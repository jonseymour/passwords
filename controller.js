function controller(){

   var form = document.forms["generator"];
   var messagePanel = document.getElementById("messages");
   var countPanel = document.getElementById("count");
   var confirmedPanel = document.getElementById("confirmed");
   var title = document.getElementById("title");
   var collapseAdvanced = document.getElementById("collapse-advanced");
   var expandAdvanced = document.getElementById("expand-advanced");
   var advanced=document.getElementById("advanced");
   var message="";
   var output="";
   var maxseekcount=1024;
   var count=0;
   var search;
   var timer;

   function read_form()
   {
	message='';
	output=form.output.value;
	maxseekcount=parseInt(form.maxseekcount.value);
	search=form['search'].value;
   }

   function clear_sensitive()
   {
       try {
	    var orig=form.secret.value+form.secret_confirm.value+form.output.value+form.search.value;
	    output='';
	    form.secret.value='';
	    form.secret_confirm.value='';
	    form.output.value='';
	    form.search.value='';
	    if (orig != '') {
		message = 'sensitive values cleared by timeout';
	    }
	} catch (e) {
	    message = 'timeout failed to clear sensitive values';
	}
	update_form();
   }

   function update_form()
   {
      if (form.show.checked) {
	 form.output.type="text";
      } else {
	 form.output.type="password";
      }
      if (form.secret.value == form.secret_confirm.value) {
	  confirmedPanel.innerHTML=form.secret.value == '' ? '' : 'ok';
      } else {
	 confirmedPanel.innerHTML='not confirmed'
      }
      form.maxseekcount.value=maxseekcount;
      form.output.value=output;
      countPanel.innerHTML=count;
      messagePanel.innerHTML=message;
      location.replace(bookmark_url());
      title.innerHTML=bookmark_title();
      if (timer) {
	  window.clearTimeout(timer);
      }
      if (form.auto.checked) {
	  timer = window.setTimeout(clear_sensitive, 60000);
      }
   }

   function bookmark_url()
   {
      var x=location.href.indexOf('?');
      var uri=x >= 0 ? location.href.substring(0,x) : location.href;
      if (uri.lastIndexOf('#') != uri.length-1) {
	  uri=uri + '#';
      }
      return uri  
	  +"?"
	  +"&user="+form.user.value
	  +"&host="+form.host.value
	  +"&salt="+form.salt.value
	  +"&initial_template="+form.initial_template.value
	  +"&next_template="+form.next_template.value;
   }

   function bookmark_title()
   {
      var tmp="password generator"
      if (form.user.value != '') {
	  tmp = tmp + " for " + form.user.value
	  if (form.host.value != '') {
	      tmp = tmp + "@"
	  }
      }
      if (form.host.value != '') {
	  if (form.user.value == '') {
	     tmp = tmp + ' ';
	  }
	  tmp = tmp + form.host.value
      }
      return tmp;
   }

   function cycle()
   {
      var template = 
	(output=='')
	? form.initial_template.value
	: form.next_template.value;
      var tmp;

      if (output!='') {
	 tmp=form.next_template.value.replace('\${secret}', form.secret.value);
	 tmp=tmp.replace('\${output}', output);
      } else {
	 tmp=form.initial_template.value.replace('\${secret}', form.secret.value);
      }

      tmp=tmp.replace('\${user}', form.user.value);
      tmp=tmp.replace('\${salt}', form.salt.value);
      tmp=tmp.replace('\${host}', form.host.value);

      output=hex_md5(tmp+'\n').substring(0,8);
      count=count+1;
   }

   form.next.onclick=function() {
      read_form();
      cycle();
      update_form();
      return false;
   };


   form.prev.onclick=function() {
      read_form();
      maxseekcount=count > 0 ? count-1 : 0;
      count=0;
      output='';
      while (count < maxseekcount) {
	 cycle();
      }
      update_form();
      return false;
   };

   form.seek.onclick=function() {
      read_form();
      if (count >= maxseekcount) {
	 message="to go further, adjust max count";
      } else {
	 while (count < maxseekcount && (output != search || search == '') ) {
	    cycle();
	 }
      }
      update_form();
   }

   form.reset.onclick=function() {
      count=0;
      maxseekcount=1024;
      output='';
      message='';
      update_form();
      return false;
   };

   form.clear.onclick=function() {
      form.secret.value='';
      form.secret_confirm.value='';
      read_form();
      update_form();
      return false;
   };

   form.search.onblur=update_form;			
   form.show.onchange=update_form;
   form.user.onblur=update_form;
   form.host.onblur=update_form;
   form.salt.onblur=update_form;
   form.secret.onblur=update_form;
   form.secret_confirm.onblur=update_form;

   function read_param(p,d)
   {
      var x=location.href.indexOf(p+"=");
      if (x>=0) {
	 var y=location.href.indexOf('&', x+1);
	 return y >= 0 ? location.href.substring(x+p.length+1,y) : location.href.substring(x+p.length+1);
      } else if (d) {
	 return d;
      } else {
	 return "";
      }
    
   }

   form.host.value=read_param('host');
   form.user.value=read_param('user');
   form.salt.value=read_param('salt');
   form.initial_template.value=read_param('initial_template', "${user}:${secret}@${host}${salt}");
   form.next_template.value=read_param('next_template', "${output}${secret}${salt}");

   update_form();

};

