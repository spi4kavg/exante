define([
	'backbone',
	'underscore',
	'text!../templates/index.html',
], function (Backbone, _, Template) {
	return Backbone.View.extend({
		template: _.template(Template),

        render: function () {
            this.$el.html(this.template());
            return this;
        }
	});
});