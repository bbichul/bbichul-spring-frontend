//진입전 로그인 확인
window.onpageshow = function (event) {
    if (sessionStorage.getItem("token") == null) {
        alert('로그인 해주세요')
        location.href = "index.html";
    }
}

//처음들어왔을때 select-box가 현재 년,월로 찍히게 하기
$("#year").val(2021);
$("#month").val(12);


$(document).ready(function () {
    // my_info()
    post_study_time_graph()
    post_weekly_avg_graph()
    get_goal_modal()
    get_resolution_modal()
    get_nickname_modal()
    get_user_team()
    get_total_time()
});

//select-box에서 월이 바뀌면 날짜에 맞는 그래프를 다시불러옴
$("select[name=month]").change(function(){
    $("select[name=year]").val();
    $(this).val();
    post_study_time_graph()
    post_weekly_avg_graph()
});

//목표시간설정-시작일 설정
function post_goal_modal() {
    let start_date = new Date($("input[name=start-date]").val())
    let end_date = new Date($("input[name=end-date]").val())
    let difference= end_date-start_date;
    let days = difference/(1000 * 3600 * 24)

    //문자열로 전환
    let start_year = start_date.getFullYear();
    let start_month = ('0' + (start_date.getMonth() + 1)).slice(-2);
    let start_day = ('0' + start_date.getDate()).slice(-2);
    let end_year = end_date.getFullYear();
    let end_month = ('0' + (end_date.getMonth() + 1)).slice(-2);
    let end_day = ('0' + end_date.getDate()).slice(-2);

    let string_start_date = start_year + '-' + start_month  + '-' + start_day;
    let string_end_date = end_year + '-' + end_month  + '-' + end_day;

    let goal_hour = $("input[name=goal_hour]").val()

    let json = {
        "startDate": string_start_date,
        "endDate": string_end_date,
        "goalHour": goal_hour
    };

    if (days >= 0) {
            $.ajax({
                type: "PUT",
                url: "https://api.bbichul.site/api/users/goal",
                data: JSON.stringify(json),
                contentType: "application/json",
                success: function (response) {
                    if (response['msg'] == "목표시간을 다시 입력해주세요") {
                        alert(response['msg'])
                    } else {window.location.reload();}
                }
            })
    }else{
        alert('시작일 종료일 설정을 다시 해주세요')
}}

function get_total_time() {
    $.ajax({
        type: "GET",
        url: "https://api.bbichul.site/api/users/time",
        contentType: "application/json",
        data: {
        },
        success: function (response) {
            let total_hour = response["totalHour"]
            $('.total-study-time').text(`(총 공부시간 : ${total_hour}시간)`)
        }
    })
}

function get_goal_modal() {
    $.ajax({
        type: "GET",
        url: "https://api.bbichul.site/api/users/goal",
        contentType: "application/json",
        data: {
        },
        success: function (response) {
            let string_start_date = response['startDate']
            let string_end_date = response['endDate']
            let d_day = response['dDay']
            let goal_hour = response['goalHour']
            let done_hour = response['doneHour']
            let percent = response['percent']

            let temp_html = `<p style="float: right">(${done_hour}/${goal_hour}시간)</p>`
            $('.progress-title').append(temp_html)

            $('.start-date-box').append(`${string_start_date}`);
            $('.end-date-box').append(`${string_end_date}`);
            $('.d-day-box').append(`D-${d_day}`);
            $('.progress-value').css('font-size', `25px`);
            $('.progress-value').css('line-height', `44px`);
            $('.progress-value').append(`${percent}%`)

            $('#percent-bar').css('width', `${percent}%`);
            $('#percent-bar').css('font-size', `18px`);
            $('#percent-bar').append(`${done_hour}h`)
        }
    })
}

function post_resolution_modal() {
    let content = $("#resolution-content").val()
    let json = {"content": content};
    $.ajax({
        type: "PUT",
        url: "https://api.bbichul.site/api/users/resolution",
        data: JSON.stringify(json),
        contentType: "application/json",
        success: function (response) {
                get_resolution_modal()
                $('#resolution-close').click()
        }
    })
}

function get_resolution_modal() {
    $.ajax({
        type: "GET",
        url: "https://api.bbichul.site/api/users/resolution",
        data: {},
        contentType: "application/json",
        success: function (response) {
            let content = response["content"]
            if (content == null) {
                $('.resolution-text').text(``)
            }else {

            $('.resolution-text').text(`${content}`)
            }
        }
    })
}
// 닉네임 변경

// function post_nickname_modal() {
//     let username = $("#nickname").val()
//     let json = {"username": username}
//
//     $.ajax({
//         type: "POST",
//         url: "https://api.bbichul.site/api/nickname-modal",
//         contentType: "application/json",
//         data: JSON.stringify(json),
//         success: function (response) {
//             if (response['msg'] == '성공') {
//                 get_nickname_modal()
//                 $('#nickname-close').click()
//             }else if (response['msg']) {
//                 alert(response['msg'])
//                 $("#nickname").val('')
//             }
//         }
//     })
// }

function get_nickname_modal() {
    $.ajax({
        type: "GET",
        url: "https://api.bbichul.site/api/nickname-modal",
        contentType: "application/json",
        data: {},
        success: function (response) {
            let nickname = response['nickName']
            $('.present-nickname').text(`${nickname}`)
        }
    })
}

// 팀 소속 확인 기능

function get_user_team() {
    $.ajax({
        type: "GET",
        url: "https://api.bbichul.site/api/users/team",
        contentType: "application/json",
        data: {},
        success: function (response) {
            let user_team = response['myTeam']
            console.log(response["myTeam"])
            if (user_team != "") {
                $(".team-list").append(`${user_team}`)
            } else {
                $(".team-list").append(`아직 팀이 없습니다.`)
            }
        }
    })
}


// 비밀번호 숨기기/보기 기능
$(".password_eye").on("mousedown", function(){
    $('.password').attr('type',"text");
}).on('mouseup mouseleave', function() {
    $('.password').attr('type',"password");
});

// 비밀번호 변경전 확인기능

// function post_check_password() {
//     let password = $('#now-password').val()
//     $.ajax({
//         type: "POST",
//         url: "https://api.bbichul.site/api/check-password",
//         headers: {
//             Authorization:  getCookie('access_token')
//         },
//         data: {
//             password: password
//         },
//         success: function (response) {
//             if (response['msg'] == 'SUCCESS') {
//                 $(".password").val('')
//                 $('#now-password-staticBackdrop').modal('hide')
//                 $('#new-password-staticBackdrop').modal('show')
//             } else if (response['msg'] == 'INVALID_PASSWORD') {
//                 alert('비밀번호가 일치하지 않습니다.')
//                 $(".password").val('')
//             }
//         }
//     })
// }

// 비밀번호 변경 기능

// function post_new_password() {
//     let password = $('#new-password').val()
//     $.ajax({
//         type: "POST",
//         url: "https://api.bbichul.site/api/new-password",
//         headers: {
//             Authorization:  getCookie('access_token')
//         },
//         data: {
//             password: password
//         },
//         success: function (response) {
//             if (response['msg'] == 'SUCCESS') {
//                 alert('성공적으로 변경되었습니다.')
//                 $(".password").val('')
//                 $('#new-password-staticBackdrop').modal('hide')
//             } else if (response['msg'] == "영어 또는 숫자로 6글자 이상으로 작성해주세요") {
//                 alert(response["msg"]);
//                 $(".password").val('')
//             } else if (response['msg'] == "NEED_NEW_PASSWORD") {
//                 alert("새로운 비밀번호를 입력해주세요");
//                 $(".password").val('')
//             }
//         }
//     })
// }

//회원 탈퇴 기능
function withdrawal() {

    let start = {"status": false}

    $.ajax({
        type: "POST",
        url: "https://api.bbichul.site/api/users/withdrawal",
        contentType: 'application/json',
        data: JSON.stringify(start),

        success: function (response) {
            sessionStorage.clear()
            location.href ="index.html";
            alert("회원탈퇴가 완료되었습니다")

        }
    })
}

// 진행바
$(document).ready(function(){
    $('.progress-value > span').each(function(){
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        },{
            duration: 1500,
            easing: 'swing',
            step: function (now){
                $(this).text(Math.ceil(now));
            }
        });
    });
});

// 마이페이지 조회 기능

// function my_info() {
//     let goal_hour = $("select[name=year]").val()
//     $.ajax({
//         type: "GET",
//         url: "https://api.bbichul.site/api/my-info",
//         headers: {
//             Authorization:  getCookie('access_token')
//         },
//         data: {
//         },
//         success: function (response) {
//             // let today_study_time = response["today_study_time"]
//             let avg_study_time = response["avg_study_time"]
//
//             let temp_html = `<div>${avg_study_time}</div>`
//             $('#avg-container').append(temp_html)
//             console.log(avg_study_time)
//
//
//         }
//     })
// }


// 시간 그래프
function post_study_time_graph() {
        let year = $("select[name=year]").val()
    let month = $("select[name=month]").val()

    $.ajax({
        type: "GET",
        url: `https://api.bbichul.site/api/users/graph?type=line&year=${year}&month=${month}`,
        contentType: "application/json",
        success: function (response) {
            let day_list = response['dayList']
            let day_time_list = response['dayTimeList']

            let study_time_graph = document.getElementById('study_time_graph').getContext('2d');
            let barChart = new Chart(study_time_graph, {
                type: 'line',
                data: {
                    labels: day_list,
                    datasets: [{
                        label: "분",
                        data: day_time_list,
                        backgroundColor: 'skyblue',
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: '월별 공부시간',
                        fontSize: 20,
                        fontColor: 'gray'
                    },
                    legend: {
                        display: false,
                        align: top
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function(label, index, labels) {
                                    return parseInt(label/60) +'h';
                                },
                                beginAtZero: true,
                                stepSize: 60,
                            }
                        }]
                    }
                }
            });

        }
    })
}

// 주간 공부시간 그래프
function post_weekly_avg_graph() {
        let year = $("select[name=year]").val()
    let month = $("select[name=month]").val()
    $.ajax({
        type: "GET",
        url: `https://api.bbichul.site/api/users/graph?type=bar&year=${year}&month=${month}`,
        contentType: "application/json",
        success: function (response) {
            let monday = response['monday']
            let tuesday = response['tuesday']
            let wednesday = response['wednesday']
            let thursday = response['thursday']
            let friday = response['friday']
            let saturday = response['saturday']
            let sunday = response['sunday']


            let weekly_avg_graph = document.getElementById('weekly_avg_graph').getContext('2d');
            let barChart = new Chart(weekly_avg_graph, {
                type: 'bar',
                data: {
                    labels: ['월', '화', '수', '목', '금', '토', '일'],
                    datasets: [{
                        label: "분",
                        data: [monday, tuesday, wednesday, thursday, friday, saturday, sunday],
                        backgroundColor: '#3E83FE',
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                        align: top
                    },
                    title: {
                        display: true,
                        text: '요일별 공부시간',
                        fontSize: 20,
                        fontColor: 'gray'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function(label, index, labels) {
                                    return parseInt(label/60) +'h';
                                },
                                beginAtZero: true,
                                stepSize: 60,
                            }
                        }]
                    }
                }
            });

        }
    })
}
//유저이름 가져오기
$("#username").html(localStorage.getItem("username"));

// ajax 시 헤더 부분에 토큰 넣어주고 코드를 줄일 수 있다
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    if(localStorage.getItem('token')) {
        jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    }
});