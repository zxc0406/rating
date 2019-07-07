var Beverage = function(){};

Beverage.prototype.boilWater = function(){
    console.log("把水煮沸");
}
Beverage.prototype.brew = function(){
    throw new Error('子类必须重写该方法');  //子类重写该方法，调用时就不会调用到原型链上的这个方法
}
Beverage.prototype.pourInCup = function(){
    throw new Error('子类必须重写该方法');
}
Beverage.prototype.addCondiment = function(){
    throw new Error('子类必须重写该方法');
}

Beverage.prototype.customerWantsCondiments = function(){
    return true;
};
//模板方式的模板方法
Beverage.prototype.init = function(){
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments){
        this.addCondiment();
    }
};


var Coffee = function(){};

Coffee.prototype.brew = function(){
    console.log("用沸水泡咖啡");
}
Coffee.prototype.pourInCup = function(){
    console.log("把咖啡倒入杯子");
}
Coffee.prototype.addCondiment = function(){
    console.log("加糖和牛奶");
}



var Tea = function(){};

Tea.prototype.steepTea = function(){
    console.log("用沸水浸泡茶叶");
}
Tea.prototype.pourInCup = function(){
    console.log("把茶水倒入杯子");
}
Tea.prototype.addCondiment = function(){
    return window.confirm("请问需要加调料吗？")
}

//使用继承
Coffee.prototype = new Beverage();
Tea.prototype = new Beverage();

var coffee = new Coffee();
coffee.init();

var tea = new Tea();
tea.init();
