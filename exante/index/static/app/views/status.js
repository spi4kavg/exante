define([
    'backbone',
    'underscore',
    'text!../templates/digest.html'
], function (Backbone, _, Template) {
    return Backbone.View.extend({
        
        template: _.template(Template),

        initialize: function () {
            this.listenTo(this.model, 'change', _.bind(this.model.polling, this.model));
            this.listenTo(this.model, 'change', _.bind(this.render, this));
        },

        render: function () {
            this.$el.html(this.template({
                model: this.model.toJSON()
            }));
            componentHandler.upgradeDom();
            return this;
        }
    });
});