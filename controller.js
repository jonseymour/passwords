loader =
(function() {
    var
    timer,
    params = {
      "host": '',
      "user": '',
      "initial_template": '',
      "next_template": ''
    },
    credentials = {
    },
    config = {
	view:
	{
	    "generator": { type: 'form' },
	    "html": {},
	    "message": {},
	    "title": {},
	    "bookmark": {},
	    "title_show": {}
	},
	model:
	{
	    'maxseekcount': 1024,
	    'count': 0,
	    'search': '',
	    'output': '',
	    'message': '',
	    'host': '',
	    'user': '',
	    'initial_template': '${user}:${secret}@${host}${salt}',
	    'next_template': '${output}${secret}${salt}',
	    'salt': '',
	    'secret': '',
	    "confirm": '',
	    'show': true,
	    'auto': true,
	    'advanced': false,
	    'location': params,
	    "generator_state": "login",
	    'sessionStorage': { },
	    'localStorage': { },
	    'credential': '',
	    'seek': function() {
		if (this.count() >= this.maxseekcount()) {
		    this.message("to go further, adjust max count");
		} else {
		    while (this.count() < this.maxseekcount() && (this.output() != this.search() || this.search() == '') ) {
			this.cycle();
		    }
		}
	    },
	    "next": function() {
		this.cycle();
	    },
	    "cycle": function() {
		var template =
		    (this.output()=='')
		    ? this.initial_template()
		    : this.next_template();
		var tmp;

		if (this.output()!='') {
		    tmp=this.next_template().replace('\${secret}', this.secret());
		    tmp=tmp.replace('\${output}', this.output());
		} else {
		    tmp=this.initial_template().replace('\${secret}', this.secret());
		}

		tmp=tmp.replace('\${user}', this.user());
		tmp=tmp.replace('\${salt}', this.salt());
		tmp=tmp.replace('\${host}', this.host());

		this.output(md5.hex_md5(tmp+'\n').substring(0,8));
		this.count(this.count()+1);
	    },
	    "prev": function() {
		var limit=this.count() > 0 ? this.count()-1 : 0;
		this.count(0);
		this.output('');
		while (this.count() < limit) {
		    this.cycle();
		}
	    },
	    "clear_sensisitve": function() {
		var orig=this.secret()+this.confirm()+this.output()+this.search();
		this.output('');
		this.secret('');
		this.confirm('');
		this.search('');
		if (orig != '') {
		    this.message('sensitive values cleared by timeout');
		}
	    },
	    "location": function(map) {
		var p;
		if (arguments.length == 0) {
		  var result = {};
		  for (p in params) {
		    result[p] = this[p]();
		  }
		  return result;
		} else {
		  for (p in params) {
		    if (map[p]) {
		      this[p](map[p]);
		    }
		  }
		  return undefined;
		}
	    },
	    "clear": function() {
		this.secret('');
		this.confirm('');
	    },
	    "reset": function() {
		this.output('');
		this.message('');
		this.search('');
		this.maxseekcount(1024);
		this.count(0);
	    },
	    "id": function() {
		var
		tmp="password generator",
		map={
		    user: this.user(),
		    host: this.host()
		};

		if (map.user != '') {
		  tmp = map.user;
		  if (map.host != '') {
		    tmp = tmp + "@";
		  }
		}
		if (map.host != '') {
		  if (map.user == '') {
		    tmp = tmp + ' ';
		  }
		  tmp = tmp + map.host;
		} else {
		  tmp = "password generator";
		}
		return tmp;
	    },
	    "title": function() {
		return this.id();
	    },
            "login": function() {
		this.generator_state("select");
            },
	    "open": function() {
		if (this.credential()) {
		    this.generator_state("show");
		} else {
		    this.host("");
		    this.user("");
		    this.generator_state("details");
		}

	    },
	    "cancel": function() {
		this.generator_state("select");
	    },
	    "done": function() {
		var 
		id = this.id(), 
		obj;

		obj = credentials[id];
		if (!obj) {
		    obj = { "id":  id };
		    credentials[id] = obj;
		}

		obj.user = this.user();
		obj.host = this.host();
		obj.initial_template = this.initial_template();
		obj.next_template = this.next_template();
		obj.salt = this.salt();
		obj.count = this.count();

		this.credentials.update = true;

		this.generator_state("select");
	    },
	    "logout": function() {
		this.secret("");
		this.confirm("");
		this.generator_state("login");
	    },
	    "show": function() {
		this.generator_state("show");
	    },
	    "credentials": function() {
		var result = [ [ "", "-- add a credential --" ] ];
		for (var c in credentials) {
		   result.push([ c, c ]);
		}
		return result;
	    }
	},
	bindings:
	{
	    "maxseekcount": Binding.INTEGER(),
	    "location": Binding.QUERY(),
	    "bookmark": [
		Binding.ATTRIBUTE(
		{
		    attribute: "href",
		    model: "location",
		    modelAdapter: function(arg) {
			return location.href.split('?')[0]+Binding.QUERY.ENCODER(arg);
		    }
		}),
		Binding.INNER_HTML({model: "title"})
	    ],
	    "html": Binding.CLASS(
		{
		    modelAdapter: function(arg) {
			if (window.innerWidth && window.innerWidth <= 480) {
			    return "small";
			} else {
			    return "";
			}
		    }
		}),
	    "output_show": Binding.INPUT_VALUE({model: "output"}),
	    "title_show": Binding.INNER_HTML({model: "title"}),
	    "title": Binding.TITLE({model: "title"}),
	    "go": Binding.ACTION(
		{
		    onclick: function() {
			this.controller.bindings.location.update(true);
		    }
		}),
	    "generator": Binding.CLASS(
		{
		    model: "generator_state"
		}),
	    "sessionStorage": Binding.SESSION_STORAGE(),
	    "localStorage": Binding.LOCAL_STORAGE(),
	    "credential": Binding.OPTIONS({
		model: { 
		    value :  "credential", 
		    options: "credentials" 
		}
	    })
	}
    };

    return new mvc.Controller(config)
	 .loader(
	     function() {
		 this.bindings.location.read(true);
		 this.bindings.localStorage.read(true);
		 this.bindings.sessionStorage.read(true);
		 this.bindings.html.update(true);
		 return true;
	     });
})();
