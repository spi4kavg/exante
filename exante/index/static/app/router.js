define([
    'backbone',

    'collections/categories',
    'models/digest',

    'views/index',
    'views/filters'
], function (
    Backbone,

    CategoriesCollection,
    DigestModel,

    IndexView,
    FiltersView
) {
	return Backbone.Router.extend({
        $container: $("#site-content"),

		routes: {
			'': 'homePage',
            '/': 'homePage',
            '!/': 'homePage',
			'!/filter': 'filterPage',
            // '!/digest': 'sendDigest',
		},

		initialize: function () {
			Backbone.history.start();
		},

        homePage: function () {
            var indexView = new IndexView();

            this.$container.html(indexView.render().el);
        },

        filterPage: function () {
            var categoryCollection = new CategoriesCollection(),
                digestModel = new DigestModel(),
                filtersView = new FiltersView({
                    collection: categoryCollection,
                    model: digestModel
                });

            this.$container.html(filtersView.render().el);

            categoryCollection.fetch({reset: true});
        }

        // sendDigest: function (categories, date_start, date_end, email) {
        //     var digestModel = new DigestModel(),
        //         digestView = new DigestView({
        //             'model': digestModel
        //         });

        //     this.$container.html(digestView.render().el);

        //     digestModel.save({}, {
        //         data: {
        //             "categories": categories.split(","),
        //             "date_start": date_start,
        //             "date_end": date_end,
        //             "email": email
        //         },
        //         // type: 'POST',
        //         // emulateJSON: true,
        //         processData: true,
        //         // traditional: true
        //     });
        //     c = categories;
        //     ds = date_start;
        //     de = date_end;
        //     e = email;
        // }
	});
});