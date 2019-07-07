// console.log($);

var rating = (function(){

    var init = function(el,num){
        var $rating = $(el),
            $item = $rating.find('.rating-item');

        //点亮
        var lightOn = function(num){
            $item.each(function(index){
                if(index<num){
                    $(this).css('background-position','0 -26px');
                }
                else{
                    $(this).css('background-position','0 0');
                }
            });
        }
            
        //初始化
        lightOn(num);

        //事件绑定,事件委托（根据事件冒泡）
        $rating.on('mouseover','.rating-item',function(){  
            lightOn($(this).index()+1);
        }).on('click','.rating-item',function(){
            num = $(this).index()+1;
        });

        $rating.on('mouseout',function(){
            lightOn(num);
        });    
        };

    return {
        init:init
    };

    
})();

rating.init('#rating2',3);
rating.init('#rating',2);