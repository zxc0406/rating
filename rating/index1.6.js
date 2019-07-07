var rating =(function(){
    //继承方法
    var extend = function(subClass,superClass){
        var F = function(){};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype,constructor = subClass;
    };

    //点亮
    var Light = function(el, options) {
        this.$el = $(el);
        this.$item = this.$el.find('.rating-item');//之前缺了个this出现$el undefined报错
        this.opts = options;
        this.add = 1;
        this.selectEvent = 'mouseover';
        
    };
    //对象实例初始化方法  +对象模板模式的模板方法
    Light.prototype.init = function(){
        this.lightOn(this.opts.num);
        if(!this.opts.readOnly){
            this.bindEvent();
        }
    };
    Light.prototype.lightOn = function(num){
        num = parseInt(num);

        this.$item.each(function(index){
            if(index<num){
                $(this).css('background-position','0 -26px');
            }else{
                $(this).css('background-position','0 0');
            }
        });
    };
    Light.prototype.bindEvent = function(){
        var self = this; //self指向实例对象
        itemLength = self.$item.length;
        self.$el.on(self.selectEvent,'.rating-item',function(e){  
            var $this = $(this),
                num = 0;

            self.select(e,$this);
            num = $(this).index()+self.add;
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

    Light.prototype.select = function(){
        throw new Error('子类必须重写此方法');
    };
    Light.prototype.unbindEvent = function(){
        this.$el.off();
    };
    
    //点亮整颗
    var LightEntire = function(el, options) {
        Light.call(this,el,options);
        this.selectEvent = 'mouseover';
    };
    extend(LightEntire,Light);
    //对象实例初始化方法（直接继承父类，删掉了）

    LightEntire.prototype.lightOn = function(num){
        Light.prototype.lightOn.call(this,num);
        /* num = parseInt(num);

        this.$item.each(function(index){
            if(index<num){
                $(this).css('background-position','0 -26px');
            }else{
                $(this).css('background-position','0 0');
            }
        }); */
    };
    LightEntire.prototype.select = function(){
        self.add = 1;
    };

    //点亮半颗
    var LightHalf = function(el, options) {
        Light.call(this,el,options);
        this.selectEvent = 'mousemove';
    };
    extend(LightHalf,Light);
    //对象实例初始化方法（直接继承父类，删掉了）

    LightHalf.prototype.lightOn = function(num){
        var count = parseInt(num);
            isHalf = count !== num;
        
        Light.prototype.lightOn.call(this,count);
        /* this.$item.each(function(index){
            if(index<count){
                $(this).css('background-position','0 -26px');
            }else{
                $(this).css('background-position','0 0');
            }
        }); */

        if(isHalf){
            this.$item.eq(count).css('background-position','0 -52px');//.eq(index)遍历方法：为第index个所选元素进行操作
        }
    };
    LightHalf.prototype.select = function(e,$this){
        if(e.pageX-$this.offset().left < $this.width()/2){//半颗
            this.add = 0.5;
        }else{//整颗
            this.add = 1;
        }
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
    var init = function(el,option){//el为父元素ID
        //用户不传递参数时使用默认
        var $el = $(el),
        rating = $el.data('rating'),
            options = $.extend({},defaults,typeof option === 'object' && option);  //该方法把options覆盖defaults内容，传入空对象并返回
        if(!mode[options.mode]){  // 容错机制，当mode对象的option.mode属性不存在时，将mode的options.mode设置为默认
            options.mode = 'LightEntire';
        }
        // new LightEntire(el,options).init();
        // new LightHalf(el,options).init();
        if(!rating){//若rating实例未创建，则声明加执行，若已存在，则执行下一步
            $el.data('rating',rating = new mode[options.mode](el,options));//.data('','')向元素附加数据
            rating.init();
        }
        if(typeof option === 'string'){
            rating[option]();//这里的rating是LightEntire或LightHalf的实例对象，这是执行rating对象的option方法，即原型链上的unbindEvent方法
        }
    };

    //jQuery插件
    $.fn.extend({
        rating:function(option){
            return this.each(function(){
                init(this,option);
            });
        }
    });

    return {
        init:init,
    };
})();



/* rating.init('#rating',{
    num:2.5,
    mode:'dsa',
    // select:function(num,total){
    //     console.log(this) //第32行不使用call的话，this指向LightHalf的实例
    //     console.log(num + '/' + total);
    // },
    chosen:function(){
        rating.init('#rating','unbindEvent');//会重新调用实例化--单例问题
    }
}); */


// $('#rating').on('select',function(e,num,total){
//     console.log(num + '/' + total);
// }).on('chosen',function(e,num,total){
//     console.log(num + '/' + total);
// });

$('#rating').rating({
    mode:'LightEntire',
    num:2,
});
$('#rating2').rating({
    mode:'LightHalf',
    num:4.5,
});
$('#rating2').on('chosen',function(){
    $('#rating2').rating('unbindEvent');
});

