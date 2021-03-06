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
    config = {
	view:
	{
	    "form": { type: 'form', id: 'generator' },
	    "html": {},
	    "message": {},
	    "count": {},
	    "title": {},
	    "confirmed": {},
	    "bookmark": {}
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
	    'show': false,
	    'auto': true,
	    'advanced': false,
	    'location': params,
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
	    "confirmed": function() {
		if (arguments.length > 0) {
		    return '';
		}
		if (this.secret() == this.confirm()) {
		    return this.secret() == '' ? '' : 'ok';
		} else {
		    return 'not confirmed';
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
	    "title": function() {
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
	    "output": [
		Binding.INPUT_VALUE(),
		Binding.INPUT_TYPE(
		    {
			"model": "show",
			"modelAdapter":
			{
			    "true": "text",
			    "false": "password"
			}
		    })
	    ],
	    "go": Binding.ACTION(
		{
		    onclick: function() {
			this.controller.bindings.location.update(true);
		    }
		})
	}
    };

    return new mvc.Controller(config)
	 .loader(
	     function() {
		 this.bindings.location.read(true);
		 this.bindings.html.update(true);
		 return true;
	     });
})();
