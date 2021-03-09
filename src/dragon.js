const PAGE = {
data: {
    navigatorArrId:['introduce','watch','teacher','DB','about'],
    navigatorAcitive:'',
    scrollbars:null,
    bannerFixedOffset:496,
    navigatorHieght:70,
    isFixed:false,
},
teacherList: {
    teacherItem:[],
    index: 4,
    duration: 500,
    isLock:false,
    translateX: 0,
    defaultLength:null,
    itemWidth:null,
},
init: function() {
    this.bind();
    this.clone();
    this.render(); 
},
bind: function() {
    let navigatorList = document.getElementById('nav-list');
    window.addEventListener('scroll',this.refreshNavigator);
    this.onEventListener(navigatorList,'click','nav-item', this.goNavigator);
    let arrowPrev = document.getElementsByClassName('arrow-prev')[0];
    this.render();
    arrowPrev.addEventListener('click',this.arrowPrev);
},
refreshNavigator: function(){
    PAGE.fixedNavigator();
    PAGE.heightLightNavigator();
    
},
onEventListener: function(parentNode, action, childClassName, callback) {
    parentNode.addEventListener(action, function(e) {
        e.target.className.indexOf(childClassName) > -1 && callback(e);
    })
},
fixedNavigator:function() {
    let scrollTop = document.documentElement.scrollTop;
    let bannerFixedOffset = PAGE.data.bannerFixedOffset;
    let navContainer = document.getElementById('navigator-bar');
    let isFixed = PAGE.data.isFixed;  
    let navigatorFixed = scrollTop > bannerFixedOffset;
    if(navigatorFixed){ 
        PAGE.data.isFixed = true;
        if(!isFixed){
            PAGE.data.isFixed = true;
        }  
        navContainer.className = 'nav-container fixed-top';      
    }else{
        navContainer.className = 'nav-container';
    }
},
heightLightNavigator: function() {
    let scrollTop = document.documentElement.scrollTop;
    let navigatorArrId = PAGE.data.navigatorArrId;  
    let filterNav = navigatorArrId.filter(data => {
        return scrollTop >= Math.min(3497, document.getElementById(data).offsetTop - PAGE.data.navigatorHieght);
    });
    let navigatorActived = filterNav ? filterNav[filterNav.length - 1] : '';
    if(navigatorActived!==PAGE.data.navigatorAcitive){
        PAGE.data.navigatorAcitive = navigatorActived;
        let navItem = document.getElementsByClassName('nav-item');
        for(let i =0; i<navItem.length; i++){
            if(navItem[i].dataset.id === navigatorActived){
                navItem[i].className = 'nav-item active';
            }else{
                navItem[i].className = 'nav-item';
            }
        }
    }
},
goNavigator: function(e) {
    let navItem = e.target.dataset.id;
    let offsetTop = document.getElementById(navItem).offsetTop - PAGE.data.navigatorHieght;
    document.documentElement.scrollTop = offsetTop; 
},
teacherList: {
    teacherItem:[],
    index: 0,
    duration: 500,
    isLock:false,
    translateX: 0,
    defaultLength:null,
    itemWidth:null,
},
render: function() {
    let arrowPrev = document.getElementsByClassName('arrow-prev')[0];
    let arrowNext = document.getElementsByClassName('arrow-next')[0];
    arrowPrev.addEventListener('click',this.arrowPrev);
    arrowNext.addEventListener('click',this.arrowNext);
},
//克隆项目
clone: function() {
    let teacherItem = document.getElementsByClassName('teacher-item');
    for(let i=0; i < teacherItem.length; i++){
        teacherItemLi =teacherItem[i].cloneNode(true).outerHTML;
        PAGE.teacherList.teacherItem.push(teacherItemLi);
    };
    let teacherList = document.getElementById('teacher-list');
    let index = PAGE.teacherList.index;
    let teacherItemWidth = teacherItem[0].offsetWidth;
    console.log(teacherItemWidth);
    PAGE.teacherList.defaultLength = teacherItem.length;
    PAGE.teacherList.itemWidth = teacherItemWidth;
    PAGE.teacherList.translateX = -(teacherItemWidth) * (index + 4);
    console.log(PAGE.teacherList.translateX );
    teacherList.insertAdjacentHTML('beforeEnd',PAGE.teacherList.teacherItem.slice(0,-1).join(''));
    teacherList.insertAdjacentHTML('afterBegin',PAGE.teacherList.teacherItem.slice(1).join(''));

    PAGE.goIndex(index);
},
//滑动到显示的位置
goIndex: function(index) {
    
    let duration = PAGE.teacherList.duration;
    let itemWidth = PAGE.teacherList.itemWidth;
    let beginTranslateX = PAGE.teacherList.translateX; 
    let endTranslateX = -itemWidth * (index + 4);
    let teacherList = document.getElementById('teacher-list');
    //加锁与解锁  调用动画前获取PAGE.teacherList.isLock判断
    let isLock = PAGE.teacherList.isLock;
    if(isLock){
        return;
    }
    PAGE.teacherList.isLock = true;
    PAGE.animateTo(beginTranslateX, endTranslateX, duration, function(value){
    
        //在滑动过程回调中，设置teacher-list的偏移值
        teacherList.setAttribute('style',`transform: translateX(${value}px)`);
    },function(value) {
        //7.在滑动完毕的回调中，设置结束位置及更新PAGE.teacherList中当前显示调索引以及偏移量;
        teacherList.setAttribute('style', `transform: translateX(${value}px)`);
        PAGE.teacherList.index = index;
        PAGE.teacherList.translateX = value;
        //PAGE.teacherList.isLock = false;
    //在goIndex方法中判断，在什么时候，瞬间重置到哪个位置。
        let defaultLength = PAGE.teacherList.defaultLength;
        if(index === -4){
            index = defaultLength - 4;
            value = - (index + 4) * itemWidth;
        }
        if(index === defaultLength){
            index = 0;
            value = - (index + 4) * itemWidth;
        }
        teacherList.style.transform = `translateX(${value}px)`;
        PAGE.teacherList.index = index;
        PAGE.teacherList.translateX = value;
        PAGE.teacherList.isLock = false;
        console.log(index,value);

    });
    

},
animateTo: function( begin, end, duration, changeCallback, finishCallback){
    let startTime =Date.now();
    requestAnimationFrame(function update(){
        let dateNow = Date.now();
        let time = dateNow - startTime;
        let value = PAGE.linear(time, begin, end, duration);
        typeof changeCallback === 'function' && changeCallback(value);
        if(startTime + duration > dateNow){
            requestAnimationFrame(update);
        }else{
            typeof finishCallback === "function" && finishCallback(end);
        }
    })
},
linear: function(time, begin, end, duration) {
    return (end - begin) * time / duration + begin;
},
//绑定上一项滑动事件
arrowPrev: function() {
    let index = PAGE.teacherList.index;
    PAGE.goIndex(index - 1);
},
arrowNext: function() {
    let index = PAGE.teacherList.index;
    PAGE.goIndex(index + 1);
},
}
PAGE.init();
