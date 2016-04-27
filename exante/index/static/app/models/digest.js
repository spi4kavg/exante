define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    return Backbone.Model.extend({
        url: "/api/v1/digset/",

        polling: function () {
            if (this.get('task_id')) {

                var def = $.Deferred();

                var intID = setInterval(_.bind(function () {

                    this.fetch({
                        'data': {
                            'task_id': this.get('task_id')
                        }
                    }).then(function (data) {
                        switch(data.status.toLowerCase()) {
                            case "success":
                                def.resolve();
                                clearInterval(intID);
                                break;
                            case "failure":
                                def.reject();
                                clearInterval(intID);
                                break;
                        }
                    });

                }, this), 1000);

                return def;

            } else {
                return false;
            }
        }
    });
});