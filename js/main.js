$(document).ready(function () {
    readFromServer();
})
let attacknum = 5;
let monster_rm_hp = 150;
let brave_rm_hp = 100;
let serverURL = 'https://script.google.com/macros/s/AKfycbwgtBUEB1b_36oQHcavTOq6dtacoxDFsp1jxIgl0toyKYRTqzrIwJj1HIKYGi2I2ysldA/exec'
let monster_attack_Anime = gsap.timeline({
    // yes, we can add it to an entire timeline!
    //     scrollTrigger:{
    //       trigger:".virus_trigger",
    //       start:"top bottom",
    //      //pin:true,
    //       scrub:true,

    //   id:"abc"
    //     } 

    // scrollTrigger: {
    //   trigger: ".container",
    //   pin: true,   // pin the trigger element while active
    //   start: "top top", // when the top of the trigger hits the top of the viewport
    //   end: "+=500", // end after scrolling 500px beyond the start
    //   scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
    //   snap: {
    //     snapTo: "labels", // snap to the closest label in the timeline
    //     duration: {min: 0.2, max: 3}, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
    //     delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
    //     ease: "power1.inOut" // the ease of the snap animation ("power3" by default)
    //   }
    // }
    onComplete: function () {
        if (brave_rm_hp <= 0) {
            $('.loser-input-cont').fadeIn(500)
        } else {
            $('.attack-trigger').show()
            $('.attack-num').css("opacity", "1")
        }
    }
});


monster_attack_Anime.to(".monster-attack", {
    scale: 40, duration: 0.5,
    onComplete: () => {

        $('.brave-hp-rm').css('width', `${brave_rm_hp}%`)
    }
})
monster_attack_Anime.to(".brave-hurted", {
    y: -250, duration: 0.8,
    onComplete: () => {
        $('.brave-hp-num').html(`${brave_rm_hp}/100 `);

    }

}, "-=0.3")
monster_attack_Anime.to(".brave-hurted", { opacity: 0, duration: 0.9 }, "-=0.2")
monster_attack_Anime.to(".monster-attack", { opacity: 0, duration: 1.5 }, "-=1.5")


monster_attack_Anime.pause()
//下面那行不加的話，big_virus一開始會從-300出現
let brave_attack = gsap.timeline({

    // scrollTrigger: {
    //   trigger: ".container",
    //   pin: true,   // pin the trigger element while active
    //   start: "top top", // when the top of the trigger hits the top of the viewport
    //   end: "+=500", // end after scrolling 500px beyond the start
    //   scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
    //   snap: {
    //     snapTo: "labels", // snap to the closest label in the timeline
    //     duration: {min: 0.2, max: 3}, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
    //     delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
    //     ease: "power1.inOut" // the ease of the snap animation ("power3" by default)
    //   }
    // }
    onComplete: function () {

        if (monster_rm_hp <= 0) {
            $('.winner-input-cont').fadeIn(500)
        }
    }
});

brave_attack.to(".brave-attack", { x: -300, y: -300, duration: 2 })
brave_attack.to(".brave-attack", {
    scale: 100, duration: 0.5,
    onComplete: () => {

        $('.monster-hp-num').html(`${monster_rm_hp}/150 `);
        $('.monster-hp-rm').css('width', `${monster_rm_hp / 150 * 100}%`)
    }
})

brave_attack.to(".monster-hurted", { y: 200, duration: 0.8 }, "-=0.3")
brave_attack.to(".monster-hurted", { opacity: 0, duration: 0.9 }, "-=0.2")
brave_attack.to(".brave-attack", { opacity: 0, duration: 1.5 }, "-=1.5")
brave_attack.to(".brave-attack", { scale: 1, duration: 0 })

brave_attack.pause()

$('.attack-trigger').click(function () {
    braveAttack()
    $('.attack-trigger').hide()
    $('.attack-num').css("opacity", "0.4")
    // monster_attack_Anime.restart()
    brave_attack.restart()
})


let braveAttack = () => {
    attacknum = Math.floor(Math.random() * 14) + 13;
    console.log(attacknum)
    $('.attack-num p').html(` ${attacknum} `);
    $('.monster-hurted').html(`-${attacknum} `);
    monster_rm_hp = monster_rm_hp - attacknum;
    if (monster_rm_hp <= 0) {
        monster_rm_hp = 0
    }
    setTimeout((() => {
        console.log("sss")
        if (monster_rm_hp > 0) {
            monsterAttack()
        }
    }), 4000)
}

let monsterAttack = () => {
    monster_attack_Anime.restart()
    brave_rm_hp = brave_rm_hp - 15;
    if (brave_rm_hp <= 0) {
        brave_rm_hp = 0;


    }
    setTimeout((() => {
        console.log("sss")
    }), 1000)
}

let loserSubmit = () => {
    if ($('input[name=userName]').val() == "" || $('textarea[name=userText]').val() == "") {
        alert("格子不能為空")
    } else {
        $('.loser-input-cont').hide();
        console.log("apple")
        LoserSendToServer()
    }
}

function LoserSendToServer() {
    let parameter = {};
    parameter.userName = $('input[name=userName]').val();



    parameter.text = $('textarea[name=userText]').val();
    parameter.winOrLose = "lose"
    parameter.method = "write4"

    console.log(parameter)

    $.post(serverURL, parameter, function (data) {
        console.log(data)
        if (data.result == 'sus') {
            readFromServerWhenSubmit()
            alert('送出成功');
            // switchArticle('next');

        } else {

            alert('送出失敗 請檢查')
        }

    }).fail(function (data) {
        alert('送出失敗');
        console.log(data)
    });

}

let winnerSubmit = () => {
    if ($('input[wname=userName]').val() == "" || $('textarea[name=wuserText]').val() == "") {
        alert("格子不能為空")
    } else {
        $('.winner-input-cont').hide();
        console.log("apple")
        winnerSendToServer()
    }
}

function winnerSendToServer() {

    let parameter = {};
    parameter.userName = $('input[name=wuserName]').val();



    parameter.text = $('textarea[name=wuserText]').val();
    parameter.winOrLose = "win"
    parameter.method = "write4"

    console.log(parameter)

    $.post(serverURL, parameter, function (data) {
        console.log(data)
        if (data.result == 'sus') {
            readFromServerWhenSubmit()
            alert('送出成功');
            // switchArticle('next');

        } else {

            alert('送出失敗 請檢查')
        }

    }).fail(function (data) {
        alert('送出失敗');
        console.log(data)
    });

}

function readFromServer() {

    let parameter = {};
    parameter.method = 'readList2';


    $.post(serverURL, parameter, function (data) {
        setTable(data);

    }).fail(function (data) {
        alert(data);
    })
}

function setTable(sData) {

    let node = null
    for (let i = 0; i < sData.length; i++) {
        if (sData[i][2] == "win") {

            node = $('#Template02').html();

        } else {
            node = $('#Template01').html();
        }

        let content = node.replace('USER_NAME_HERE', sData[i][0]);
        content = content.replace('TEXT_HERE', sData[i][1]);

        if (sData[i][2] == "win") {

            $('.bdr').append(content)
        } else {
            console.log(content)
            $('.bdl').append(content)
        }

    }
    console.log(sData)
}

function readFromServerWhenSubmit() {

    let parameter = {};
    parameter.method = 'readList3';


    $.post(serverURL, parameter, function (data) {
        setTable(data);
        console.log(data)
    }).fail(function (data) {
        alert(data);
    })
}

$('.guide-btn').click(function(){
    $('.guide').fadeOut(500)
})