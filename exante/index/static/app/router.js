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
	});
});
