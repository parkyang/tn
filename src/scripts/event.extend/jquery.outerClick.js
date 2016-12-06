/**
 * 点击除指定元素区域外会触发此事件回调
 * $(xx).on('outerClick',fn)
 * $(xx).outerClick(fn)
 */
!function($){
  var elements = [],
  eventName = 'outerClick';
  function callback(event){
    var index = 0,
    length = elements.length,
    target = event.target,
    subset,
    element;
    for(;index<length;index++){
      element = elements[index];
      //判定是否为element是否包含currentTarget
      subset = (element.contains?element.contains(target):element.compareDocumentPosition?element.compareDocumentPosition(target)&16:1);
      if(element !== target&&!subset){
        $.event.trigger(eventName,event,element);
      }
    }
  }

  $.event.special[eventName] = {
    setup: function(){
      var length = elements.length;
      // 执行多次时不在绑定
      if(!length){
        $.event.add(document,'click',callback);
      }
      if($.inArray(this,elements)<0){
        elements[length] = this;
      }
    },

    teardown: function(){
      var index = $.inArray(this,elements);

      if(index >=0){
        elements.splice(index,1);
        //全部元素off掉再卸载
        if(!elements.length){
          $.event.remove(document,'click',callback);
        }
      }
    }
  };

  $.fn[eventName] = function(callback){
    return typeof callback === 'function'?this.on(eventName,callback):this.trigger(eventName);
  }
}(jQuery);
