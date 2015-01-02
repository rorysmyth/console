$(function(){

	function Bootstrap(){
		this.components = [];
		this.services = [];
		this.serviceTags = [];
		this.componentTags = [];
	}

	Bootstrap.prototype.addComponent = function (data) {
		this.components.push(data)
		return this;
	}

	Bootstrap.prototype.addService = function (data) {
		this.services.push(data)
		return this;
	}

	Bootstrap.prototype.bootStrap = function () {


		if (this.components.length == 0 && this.services.length == 0) {
			return;
		};
		
		var $this = this;

		$.each(this.components, function (index, component) {

			if ( component.controllers.length > 0 ) {
				$.each(component.controllers, function (index, controller) {
					var template = "\<script src='/js/app/{{{dir}}}/controllers/{{{controller}}}.js'\>\</script\>";
					var tag = template.replace("{{{dir}}}", component.dir).replace("{{{controller}}}", controller);
					$this.componentTags += tag;
				});
			}

			if ( component.directives.length > 0 ) {
				$.each(component.directives, function (index, directive) {
					var template = "\<script src='/js/app/{{{dir}}}/directives/{{{directive}}}.js'\>\</script\>";
					var tag = template.replace("{{{dir}}}", component.dir).replace("{{{directive}}}", directive);
					$this.componentTags += tag;
				});	
			}

		});

		if (this.services.length > 0) {
			$.each(this.services[0], function (index, service) {
				var template = "\<script src='/js/app/services/{{{service}}}.js'\>\</script\>";
				var tag = template.replace("{{{service}}}", service);
				$this.serviceTags += tag;
			});
		};

		$('body')
			.append(this.serviceTags)
			.append(this.componentTags);

	}

	var app = new Bootstrap;
	app
		.addService([
			'conductor'
		])
		.addComponent({
			dir:'control-panel',
			controllers: ['control-panel'],
			directives: ['control-panel']
		})
		.addComponent({
			dir:'call-growl',
			controllers: ['call-growl'],
			directives: ['call-growl']
		})
		.addComponent({
			dir:'call-worker',
			controllers: ['call-worker'],
			directives: []
		})
		.bootStrap();


});