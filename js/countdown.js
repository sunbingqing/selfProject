var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 6;
var MARGIN_LEFT = 200;
var MARGIN_TOP = 50;

const endTime = new Date(2017,6,7,14,31,55); //设置一个小于四天的截止时间（我们的时分秒只设置了两位数的位置，大于四，5*24=120就没法显示了），由于JavaScript的Date()方法的月份是从0-11的，也就是说现在的七月要写成6
var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#66FFB3","#66FFB3","#66B3FF","#6666FF","#B366FF","#FF66FF","#FF66B3","#FF6666","#FFB366","#FFFF66"];


window.onload = function(){
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(
        function(){
            render(context); // 绘制当前的画面
            update(); // 对当前的数据进行调整
        },50
    );
    
}

function getCurrentShowTimeSeconds(){
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime(); //getTime()方法可返回距1970年1月1日之间的毫秒数
    ret = Math.round(ret/1000); // round()方法可把一个数字舍入为最接近的整数，我们这里只需要精确到秒

    return ret >= 0 ? ret : 0;
}

function update(){
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    //下一秒的时间
    var nextHours = parseInt(nextShowTimeSeconds/3600);
    var nextMinutes = parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds = nextShowTimeSeconds%60;
    //当前的时间
    var curHours = parseInt(curShowTimeSeconds/3600);
    var curMinutes = parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds = curShowTimeSeconds%60;

    if(nextShowTimeSeconds != curShowTimeSeconds){
        if(parseInt(curHours/10) != parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHours/10));
        }
        if(parseInt(curHours%10) != parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
        }
        if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
        }
        if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
        }
        if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
        }
        if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}
//创建彩色的小球
function addBalls(x,y,num){
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                var aballs = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1,Math.ceil(Math.random()*10))*4,
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }
                balls.push(aballs);
            }
        }
    }
}

function updateBalls(){
    for(var i=0;i<balls.length;i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy +=balls[i].g;

        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = -balls[i].vy*0.5;
        }
    }
}

function render(cxt){
    //绘制时间
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds/3600);
    var minutes = parseInt((curShowTimeSeconds-hours*3600)/60);
    var seconds = curShowTimeSeconds%60;

    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
    renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
    renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
    renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

    //绘制彩色小球
    for(var i=0;i<balls.length;i++){
        cxt.fillStyle = balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit(x,y,num,cxt){
    cxt.fillStyle = "rgb(0,102,153)";

    for(var i = 0; i < digit[num].length; i++){
        for(var j = 0; j < digit[num][i].length; j++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI);
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}