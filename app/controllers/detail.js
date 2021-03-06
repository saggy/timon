/**
 * detail.js
 * Populate the data-box with attributes for selected document
 */

exports.createAttributeView = function(_id) {
	
	/* Find a model with given _id.
	 * .where({_id:_id}) will returns an array of backbone models,
	 * here should contain just one; in order to handle it
	 * get a reference to it with [0], 
	 * define a js object containing its attributes key:value pairs.
	 * (? findWhere() is undefined?)
	 */
	var model = Alloy.Globals.docs.where({_id:_id})[0];
	var doc = model.toJSON();
	
	// make an array of alphabetical sorted doc's attributes
	var attributes_keys = _.keys(doc);
	
	// clean up old data-box if any
	$.data_box &&  $.detail.remove($.data_box);
	$.update_btn &&  $.detail.remove($.update_btn);
	$.title_lbl && $.detail.remove($.title_lbl);
	
	// returns a key:value form field view
	var fieldFactory = function(attribute) {
		var self = Ti.UI.createView({
			top: "20dp",
			left: "10dp",
			width:Ti.UI.FILL,
			height: Ti.UI.SIZE,
			layout: "horizontal",
			
		});
		var keyLabel = Ti.UI.createLabel({
			width:"25%",
			font: {
				fontSize:"14dp",
			},
			text: attribute
		});
		var valueLabel = Ti.UI.createTextField({
			value: doc[attribute],
			autocapitalization:false,
			width:"72%",
			backgroundColor:"#fff"
		});
		self.add(keyLabel);
		self.add(valueLabel);
		return self;
	};
	
	// form container
	$.data_box = Ti.UI.createView({
		layout:"vertical",
		backgroundColor: "#efefef",
		width:"90%",
		height:Ti.UI.SIZE
		
	});
	
	/****
	/* create and add fields to the data-box view
	 */

	_.each(attributes_keys, function(attribute) {
		if (attribute !== "_id" && attribute !== "_title_") {
			$[attribute] = fieldFactory(attribute);
			$.data_box.add($[attribute]);
		}	
	});

	$.data_box.add(Ti.UI.createView({
		height:"10dp",
	}));

	/**/
	
	// display a title (the doc._id)
	$.title_lbl = Ti.UI.createLabel({
		top:"40dp",
		width:"90%",
		color: "#efefef",
		backgroundColor: "#020202",
		text: " " + doc._title_,
		font: {
			fontSize:"18dp",
			fontWeight:"bold"
		}
	});
	$.detail.add($.title_lbl);
	
	$.detail.add($.data_box);
	
	// Update button and operation
	$.update_btn = Ti.UI.createButton({
		title: "[ Update the document ]",
		top:"40dp"
	});
	
	$.update_btn.addEventListener('click', function(){
		var payload = {};
		_.each(attributes_keys, function(attribute) {
			if (attribute !== "_id" && attribute !== "_title_") {
				var value = $[attribute].children[1].value;
				payload[attribute] = value;
			}
		});
		var dialogs = require('alloy/dialogs'); 
		dialogs.confirm(
			{	message: 'Are you sure you want to make changes?',
				callback: function() {
					model.save(payload, 
						{
							success: function(model, response){
								Ti.API.info(response)
							},
							error: function(model, response){
								Ti.API.debug(response);
							}
						}
					);
			}}
		);
	});

	$.detail.add($.update_btn);

};

exports.cleanDataBox = function(){
	$.detail.remove($.data_box);
	$.detail.remove($.update_btn);
	$.detail.remove($.title_lbl);
}
