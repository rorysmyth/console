
app.service('conductorService', function($log){

	this.incoming = {
		name: "John Smith",
		company: 'National Geographic',
		state: null,
		min:false,
		type: 'incoming',
		z:1,
		y:0
	}

	this.outgoing = {
		name: "Don Livingston",
		company: 'Zendesk',
		state:null,
		min:false,
		type: 'outgoing',
		z:0,
		y:0
	}

	this.keypad = {
		active:true,
		state:null
	}

});