
var rating =(function(){
    //点亮整颗
    var LightEntire = function(el, options) {
        this.$el = $(el);
        this.$item = this.$el.find('.rating-item');//之前缺了个this出现$el undefined报错
        this.opts = options;
    };
    //对象实例初始化方法
    LightEntire.prototype.init = function(){
        this.lightOn(this.opts.num);
        if(!this.opts.readOnly){
            this.bindEvent();
        }
    };
    LightEntire.prototype.lightOn = function(num){
        num = parseInt(num);

        this.$item.each(function(index){
            if(index<num){
                $(this).css('background-position','0 -26px');
            }else{
                $(this).css('background-position','0 0');
            }
        });
    };
    LightEntire.prototype.bindEvent = function(){
        var self = this; //self指向实例对象
        itemLength = self.$item.length;
        self.$el.on('mouseover','.rating-item',function(){  
            var num = $(this).index()+1;
            self.lightOn(num);  //这里用this的话会this存在于mouseover事件函数中，没有指向实例对象

            (typeof self.opts.select === 'function') && self.opts.select.call(this,num,itemLength);
            self.$el.trigger('select',[num,itemLength]);
        }).on('click','.rating-item',function(){
            self.opts.num = $(this).index()+1;
            (typeof self.opts.chosen === 'function') && self.opts.chosen.call(this,self.opts.num,itemLength);
            self.$el.trigger('chosen',[self.opts.num,itemLength]);
        }).on('mouseout',function(){
            self.lightOn(self.opts.num);
        });        
    };


    //点亮半颗
    var LightHalf = function(el, options) {
        this.$el = $(el);
        this.$item = this.$el.find('.rating-item');//之前缺了个this出现$el undefined报错
        this.opts = options;
        this.add = 1;
    };
    //对象实例初始化方法
    LightHalf.prototype.init = function(){
        this.lightOn(this.opts.num);
        if(!this.opts.readOnly){
            this.bindEvent();
        }
    };
    LightHalf.prototype.lightOn = function(num){
        var count = parseInt(num);
            isHalf = count !== num;
        

        this.$item.each(function(index){
            if(index<count){
                $(this).css('background-position','0 -26px');
            }else{
                $(this).css('background-position','0 0');
            }
        });

        if(isHalf){
            this.$item.eq(count).css('background-position','0 -52px');//.eq(index)遍历方法：为第index个所选元素进行操作
        }
    };
    LightHalf.prototype.bindEvent = function(){
        var self = this; //self指向实例对象
        itemLength = self.$item.length;
        self.$el.on('mousemove','.rating-item',function(e){  
            var $this = $(this);
                num = 0;
            if(e.pageX-$this.offset().left<$this.width()/2){//半颗
                self.add = 0.5;
            }else{//整颗
                self.add = 1;
            }

            num = $this.index()+self.add;

            self.lightOn(num);  //这里用this的话会this存在于mouseover事件函数中，没有指向实例对象

            (typeof self.opts.select === 'function') && self.opts.select.call(this,num,itemLength);
            self.$el.trigger('select',[num,itemLength]);
        }).on('click','.rating-item',function(){
            self.opts.num = $(this).index()+self.add;
            (typeof self.opts.chosen === 'function') && self.opts.chosen.call(this,self.opts.num,itemLength);
            self.$el.trigger('chosen',[self.opts.num,itemLength]);
        }).on('mouseout',function(){
            self.lightOn(self.opts.num);
        });        
    };

    //默认参数
    var defaults = {
        mode:'LightEntire',
        num:0,  //默认点亮个数
        readOnly:false,  
        select:function(){},  //鼠标移到星星上时执行的方法
        chosen:function(){},  //点击某颗星星时执行的方法，比如把评分通过ajax发送
    };

    var mode = {
        'LightEntire':LightEntire,
        'LightHalf':LightHalf,
    };

    //初始化
    var init = function(el,options){
        //用户不传递参数时使用默认
        options = $.extend({},defaults,options);  //该方法把options覆盖defaults内容，传入空对象并返回
        // new LightEntire(el,options).init();
        // new LightHalf(el,options).init();
        if(!mode[options.mode]){
            options.mode = 'LightEntire';
        }
        new mode[options.mode](el,options).init();
    };

    return {
        init:init,
    };
})();

rating.init('#rating',{
    num:2.5,
    mode:'LightHalf',
    // select:function(num,total){
    //     console.log(this) //第32行不使用call的话，this指向LightHalf的实例
    //     console.log(num + '/' + total);
    // },

});
// $('#rating').on('select',function(e,num,total){
//     console.log(num + '/' + total);
// }).on('chosen',function(e,num,total){
//     console.log(num + '/' + total);
// });
