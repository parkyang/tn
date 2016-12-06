(function(w,$){
  var DEFAULTS = {
      template: {
          select:'<div class="tn-select"><div class="select-label"><div class="select-text"></div><span class="caret"></span></div></div>',
          list:'<ul class="select-menu"></ul>',
          li:'<li$value$$class$$title$>$text$</li>'
      },
      container:!1,
      size:10,
      zIndex:3
  },TN_NSpace = 'tn.select';
  function addClassForStr(obj,attrs){
    var cls = [' class="','"'],arr = [];
    var i = 0;
    for(;i<attrs.length;i++){
      if(obj[attrs[i]]){
        arr.push(obj[attrs[i]]);
      }
    }
    !arr.length||cls.splice(cls.length-1,0,arr.join(' '));
    return cls.length>2?cls.join(''):'';
  }
  var TnSelect = function(elem,options){
    var self = this;
    this.elem = $(elem).hide();
    this.options = options;
    this.type = TN_NSpace;
    this.container = $(this.options.template.select);
    this.selectLabel = this.container.find('.select-label');
    this.selectText = this.selectLabel.find('.select-text');
    this.selectMenu = $(this.options.template.list);
    this.isDisabled = typeof(this.elem.attr('disabled'))!='undefined'||this.elem.hasClass('disabled');
    !this.isDisabled||(this.container.addClass('disabled')&&this.container.attr('disabled','disabled'));
    if(!self.isDisabled){
      this.selectLabel.on('click',function(){
        self.toggle();
      });
      this.container.on('outerClick',function(){
        self.hide();
      });
      if(!this.options.multiple){
        this.selectMenu.on('click',function(){
          self.hide();
        });
      }
      this.selectMenu.on('click','li',function(e){
        if(self.options.multiple){
          $(this).toggle('selected');
        }else{
          if($(this).hasClass('selected')){
            return;
          }else{
            $(this).siblings().removeClass('selected');
            $(this).addClass('selected');
          }
        }
        var val = [];
        $(this).parent().children('.selected').each(function(){
          val.push($(this).attr('rel'));
        });
        self.val(val);
        self.elem.trigger('change',[e,self.elem.val(),$(this)]);
      });
    }

    if(this.options.multiple){
      this.elem.attr('multiple','multiple');
    }
    this.refresh();
    this.elem.data('selectMenu',this.selectMenu.appendTo(this.container));
    this.container.insertAfter(this.elem);
  };
  TnSelect.proto = TnSelect.prototype;
  //设置value
  TnSelect.proto.val = function(val){
    var $options = this.selectMenu.children('li'),
        selected = [];
    this.elem.val(val.join(val.length>1?',':''));
    this.elem.find('option').each(function(index){
      var $current = $options.eq(index);
      $current.toggleClass('selected',$(this).is(':selected'));
      !$current.hasClass('selected')||selected.push($current.html());
    });
    this.selectText.html(selected.join(''));
  };
  //显示
  TnSelect.proto.show = function(){
    this.elem.trigger('show.'+this.type);
    var css = {};
    if(!this.maxHeight){
      css.maxHeight = this.maxHeight = this.options.size*this.selectLabel.outerHeight();
    }
    css.zIndex = this.options.zIndex;
    this.selectMenu.css(css).show();
    this.container.addClass('open');
    this.elem.trigger('shown.'+this.type);
  };
  //隐藏
  TnSelect.proto.hide = function(){
    this.elem.trigger('hide.'+this.type);
    this.selectMenu.css({zIndex:0}).hide();
    this.container.removeClass('open');
    this.elem.trigger('hidden.'+this.type);
  };
  //切换下拉显示状态
  TnSelect.proto.toggle = function(){
    this.selectMenu.is(':hidden')?this.show():this.hide();
  };
  //刷新
  TnSelect.proto.refresh = function(){
    var that = this,
        html = '';
    this.elem.find('option').each(function(index){
        var className = $(this).attr('class'),
            obj = {
                value:' rel="'+$(this).val()+'"',
                text:$(this).html()||'',
                title:$(this).attr('title')?(' title="'+($(this).attr('title'))+'"'):'',
                selected:$(this).is(':selected')?'selected':'',
                'class':$(this).attr('class')||'',
                disabled:typeof($(this).attr('disabled'))==='string'?'disabled':''
            };
        obj['class'] = addClassForStr(obj,['class','selected','disabled']);
        html += that.options.template.li.replace(/\$(\w+)\$/g,function(a,b){
            return obj[b]||'';
        });
        !$(this).is(':selected')||that.selectText.html(obj.text);
    });
    this.selectMenu.html(html);
  };
  //修改全部列表
  TnSelect.proto.html = function(html){
    this.elem.html(html);
    this.refresh();
  };
  //reset
  TnSelect.proto.reset = function(){
    setTimeout($.proxy(function(){
      this.val(this.elem.val().split(','));
    },this),100);
  };

  function Plugins(option){
      var arg2 = arguments[1];
      return $(this).filter('select').each(function(){
          var data = $(this).data(TN_NSpace),
              options = typeof option === 'object' && option,
              settings = {};
          !$(this).data('size')||(settings.size = $(this).data('size'));
          !$(this).data('multiple')||(settings.multiple = $(this).data('multiple'));
          options = $.extend({},DEFAULTS,option,settings);
          if(!data && /destroy|hide/.test(options))return;
          if(!data){
            $(this).data(TN_NSpace,data = new TnSelect(this,options));
          }
          if(typeof option == 'string'){
            typeof(arg2)!=='undefined'?data[option](arg2):data[option]();
          }
      });
  }

  var old = $.fn.tnSelect;
  $.fn.tnSelect = Plugins;
  $.fn.tnSelect.Constructor = TnSelect;
  w.tnComponents = w.tnComponents||[];
  w.tnComponents.push('tnSelect');

  $(function(){
    $('select.tn-select').tnSelect();
    $(document).on('reset','form',function(){
      $(this).find('select.tn-select').each(function(){
        var _tnSelect = $(this).data(TN_NSpace);
        if(_tnSelect){
          _tnSelect.reset();
        }
      });
    });
  });
})(window,$);
