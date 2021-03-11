$(function() {
    const PAGE = {
        data: {
            navArrId: ['introduce', 'watch', 'teacher','DB', 'about'],
            navActived: '',
            navIsFixed: false,
            navHeight: 70,
            bannerHeight: 496,
            itemArr: [],
            defaultItemLength: null,
            itemWidth: null,
            marginLeft: null,
            duration: 500,
            index: 0,
            isLock: false,
        },
        init: function() {
            this.bind();
            this.clone();
        },
        bind: function() {
            window.addEventListener('scroll', this.refreshNav);
            $('#navigator-bar').on('click',this.goNav);
            $('.arrow-prev').on('click',this.arrowPrev);
            $('.arrow-next').on('click',this.arrowNext);
            $('section.lesson-list dt').on('click',this.hideLesson);
        },
        refreshNav: function() {
            PAGE.navFixed();
            PAGE.highLightNav();
        },
        navFixed: function() {
            let bannerHeight = PAGE.data.bannerHeight;
            let navIsFixed = PAGE.data.navIsFixed;
            if($('html').scrollTop() >= bannerHeight){
                if(navIsFixed){
                    return
                }
                PAGE.data.navIsFixed = true;
                $('#navigator-bar').addClass(' fixed-top');
            }else{
                PAGE.data.navIsFixed = false;
                $('#navigator-bar').removeClass('fixed-top');     
            }
        },
        goNav: function(ele) {
            let navId = $(ele.target).attr('data-id');
            let navOffsetTop = $(`#${navId}`).offset().top - PAGE.data.navHeight;
            $('html').scrollTop(navOffsetTop);
        },
        highLightNav: function() {
            let bannerHeight = PAGE.data.bannerHeight;
            let navHeight = PAGE.data.navHeight;
            let navArrId = PAGE.data.navArrId;
            let navArr = navArrId.filter(function(navId) {
                return  $('html').scrollTop() >= Math.min(3497,$(`#${navId}`).offset().top - navHeight);
            });
            let navActived = navArr ? navArr[navArr.length - 1] : '';
            if(PAGE.data.navActived !== navActived){
                PAGE.data.navActived = navActived;
                if($('.nav-item').hasClass('active')){
                    $('.nav-item').removeClass('active');
                };
                $(`li[data-id = ${navActived}]`).addClass(' active');
            }
            

            
        },
        clone: function() {
            PAGE.data.defaultItemLength = $('.teacher-item').length;
            PAGE.data.itemWidth = $('.teacher-item').width();
            let index = PAGE.data.index ;
            let itemWidth = PAGE.data.itemWidth;   
            PAGE.data.marginLeft = - itemWidth * (index + 4);  
            PAGE.data.itemArr = $('.teacher-item').clone();
            let teacherItem = PAGE.data.itemArr;
            $('#teacher-list').append($('.teacher-item').clone().slice(0, PAGE.data.defaultItemLength - 1)).prepend($(teacherItem).slice(1));
            $('#teacher-list').attr('style',`margin-left:${PAGE.data.marginLeft}px`);
        },
        goIndex: function(index) {
            let duration = PAGE.data.duration;
            let itemWidth = PAGE.data.itemWidth;          
            let isLock =PAGE.data.isLock;
            if(isLock){
                return
            }
            PAGE.data.isLock = true;      
            PAGE.data.index = index;           
            $('#teacher-list').animate({'margin-left': '-='+itemWidth}, duration, function(){
                if(index === -4){
                    index = 1;
                    PAGE.data.index = index;
                    $('#teacher-list').css('margin-left', itemWidth * (index + 4));  
                }
                if(index === 5){
                    index = 0;
                    PAGE.data.index = index;
                    $('#teacher-list').css('margin-left', -itemWidth * (index + 4)); 
                }
                PAGE.data.isLock = false;
            })
        },
        arrowPrev: function() {
            let index = PAGE.data.index;
            PAGE.data.itemWidth = - $('.teacher-item').width();   
            PAGE.goIndex(index - 1);
        },
        arrowNext: function() {
            let index = PAGE.data.index;
            PAGE.data.itemWidth =  $('.teacher-item').width()
            PAGE.goIndex(index + 1);
        },
        hideLesson: function(e) {
            $(e.target).children('i').toggleClass('close');
            $(e.target).siblings('dd').slideToggle('slow');
        }
    }
    PAGE.init();
})