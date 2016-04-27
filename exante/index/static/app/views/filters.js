define([
	'backbone',
	'underscore',
	'text!../templates/filters.html',
	'text!../templates/status.html',
	'moment',
	'pikaday-jquery',
	'select2',
	'validate',
	'mdl',
], function (Backbone, _, Template, StatusTemplate, moment) {

	return Backbone.View.extend({
		error: "",

		template: _.template(Template),

		events: {
			'click #send-button': 'send',
			'click .mdl-dialog button.refresh': 'refresh'
		},

		initialize: function () {
			this.listenTo(this.collection, 'reset', _.bind(this.render, this));
			this.listenTo(this.model, 'change', _.bind(this.showPopup, this));
		},

		serialize: function () {
			var categories = $("[name='categories']", this.$el).data('select2').val() || [],
				date_start = $("[name='date_start']", this.$el).data('pikaday').getDate(),
				date_end = $("[name='date_end']", this.$el).data('pikaday').getDate(),
				email = $("[name='email']", this.$el).val() || "";
			return {
				'categories': categories,
				'date_start': date_start,
				'date_end': date_end,
				'email': email
			};
		},

		validate: function (data) {
			this.error = "";

			if (this.$el.find(".mdl-textfield.is-invalid").length) {
				return false;
			}

			if (!data.categories.length) {
				this.error = "Поле категории обязательно для заполнения";
				return false;
			}

			if (!data.date_start || !data.date_end) {
				this.error = "Поле даты обязательно для заполнения";
				return false;
			}

			if (!data.email) {
				this.error = "Поле email обязательно для заполнения";
				return false;
			}

			if (data.date_start > data.date_end) {
				this.error = "Дата конца должна быть больше даты начала";
				return false;
			}

			if (data.date_start > new Date()) {
				this.error = "Дата начала должна быть меньше или равна сегодняшней дате";
				return false;
			}

			return true;
		},

		showPopup: function () {
			var template = _.template(StatusTemplate),
				dialog = this.$el.find('.mdl-dialog');
			dialog.find('.mdl-dialog__content').html(template({
				model: this.model.toJSON()
			}));

			if (!dialog[0].open) {
				dialog[0].showModal();
			}

			componentHandler.upgradeDom();
		},

		send: function () {
			var data = this.serialize();
			if (!this.validate(data)) {
				if (this.error.length) {
					var el = this.$el.find("#form-error-snackbar")[0];
					new MaterialSnackbar(el).showSnackbar({
						message: this.error
					});
				}
			} else {
				var def = this.model.save({}, {
	                data: {
	                    "categories": _.map(data.categories, function (v) {
	                    	return parseInt(v, 10);
	                    }),
	                    "date_start": moment(data.date_start).format("YYYY-MM-DD"),
	                    "date_end": moment(data.date_end).format("YYYY-MM-DD"),
	                    "email": data.email
	                },
	                processData: true,
	            });

	            def.then(_.bind(function (data) {
	            	if (!this.get('errors')) {
	            		this.polling(this.get('task_id'));
	            	}
	            }, this.model));
			}
		},

		render: function () {
			this.$el.find('select').select2('destroy');
			var compiledTemplate = this.template({
				'categories': this.collection.models
			});
			this.$el.html(compiledTemplate);

			this.$el.find("select[name='categories']").select2({
				'minimumInputLength': 1,
				'placeholder': 'Начните набирать название категории'
			});

			this.$el.find("[name='date_start']").pikaday({
				format: "YYYY-MM-DD",
				placeholder: "Дата начала"
			});

			this.$el.find("[name='date_end']").pikaday({
				format: "YYYY-MM-DD",
				placeholder: "Дата конца"
			});

			componentHandler.upgradeDom();

			return this;
		},

		refresh: function () {
			this.$el.find('.mdl-dialog')[0].close();
		}
	});
});