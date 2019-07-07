var num = 3;
    var rating = document.getElementById("rating");
    var item = rating.getElementsByTagName("li");
    

//forEach()用法？
    /* var lightOn = function(num){
        item.forEach(function(index){
            if(index<num){
                this.style.backgroundPosition = '0 -26px';
            }
            else{
                this.style.backgroundPosition = '0 0';
            }
        });
    } */
//点亮
var lightOn = function(num){
    for(var i=0;0<item.length;i++){
        (function(o){
            if(o<num){
                item[o].style.backgroundPosition = '0 -26px';
            }
            else{
                item[o].style.backgroundPosition = '0 0';
            }
        })(i);
    }
}

//初始化
lightOn(num);

//事件绑定
for(var i=0;i<item.length;i++){
    (function(a){
        item[a].addEventListener('mouseover',function(){
            lightOn(a+1);
        });
        item[a].addEventListener('click',function(){
            num = a+1;
        });
    })(i);
}
rating.addEventListener('mouseout',function(){
    lightOn(num);
})
