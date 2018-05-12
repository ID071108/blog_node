/**
 * created by shuwang on 2018/4/26
*/
// 获取表单数据
function getParams(str) {
    let serializeArr = str.split("&")
    let data = {}
    for (let serializeItem of serializeArr) {
        let arr = serializeItem.split("=")
        data[arr[0]] = arr[1]
    }
    return data
}
/**
 * dom加载完成之后进行操作
 * */
$(function () {
    var $signBox = $(".signBox");
    // 注册界面dom
    var $signup = $(".signup");
    var $signup_form = $signup.find("form");
    var $signup_uname = $signup.find("input[name=username]")
    var $signup_psw = $signup.find("input[name=password]")
    var $signup_psw_confirm = $signup.find("input[name=password_confirm]")
    // 登录界面dom
    var $signin = $(".signin");
    var $signin_form = $signin.find("form");
    var $signin_uname = $signin.find("input[name=username]")
    var $signin_psw = $signin.find("input[name=password]")
    // 用户信息界面
    var $userInfo = $(".userInfo");
    /**
     * 统一操作输入框输入, 失焦事件
    */
    // 验证是否为空
    function validateIsEmpty(target) {
        var _this = $(target)
        let _thisNext = _this.next()
        _this.val() ? _thisNext.css("visibility", "hidden") : _thisNext.css("visibility", "visible").html(_this.prev().html() + "不能为空")
    }
    // 不能输入空格
    $(".signBox").on("input", "input", function (e) {
        let _this = $(this)
        _this.val(_this.val().trim())
        validateIsEmpty(this)
    })
    // 不能为空
    $(".signBox").on("blur", "input", function (e) {
        let _this = $(this)
        validateIsEmpty(this)
    })

    /**
     * 登录页面逻辑
    */
    // 登录按钮 切换到注册页面
    $(".signup_link").click(function () {
        $signin.slideUp(100, function () {
            $signup.slideDown(100);
            $signup_form.find("p").css("visibility", "hidden");
            $signup_form.find("input").val("");
            $signup_form.find("input[type=submit]").val("注册");
        });
    })
    $signin.find("form").on("submit", function (e) {
        e.preventDefault();
        let serialize = $(this).serialize();
        let params = getParams(serialize);
        let username = params.username;
        let password = params.password;
        if (username && password) {
            // 发送请求
            $.ajax({
                type: "POST",
                url: "/api/user/signin",
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code) {
                        window.location.reload();
                    } else {
                        $signin_psw.next().css("visibility", "visible").html(data.message);
                    }
                }
            })
        } else {
            !username && $signin_uname.next().css("visibility", "visible").html("帐号不能为空")
            !password && $signin_psw.next().css("visibility", "visible").html("密码不能为空")
            return false;
        }
    });

    /**
     * 注册页面逻辑
    */
    // 验证输入是否正确
    // 注册按钮 切换到登录页面
    $(".signin_link").click(function () {
        $signup.slideUp(100, function () {
            $signin.slideDown(100);
            $signin_form.find("p").css("visibility", "hidden");
            $signin_form.find("input").val("");
            $signin_form.find("input[type=submit]").val("登录");
        });
    })
    $signup.find("form").on("submit", function (e) {
        e.preventDefault();
        // 取得用户输入的数据
        let params = getParams($(this).serialize());
        let username = params.username;
        let password = params.password;
        let password_confirm = params.password_confirm;
        // 是否存在值为空的情况
        if (username && password && password_confirm) {
            // 两次输入的密码是否一致
            if (password_confirm !== password) {
                $signup.find(".validate_msg").css("visibility", "visible").html("两次输入的密码不一致");
                return false;
            } else {
                $signup.find(".validate_msg").css("visibility", "hidden");
                $.ajax({
                    type: "POST",
                    url: "/api/user/register",
                    data: params,
                    dataType: "json",
                    success: function (data) {
                        if (data.code) {
                            $signup_psw_confirm.next().css("visibility", "visible").html(data.message);
                            $signup.delay(1000).slideUp(100, function () {
                                $signin.slideDown(100);
                            });
                        } else {
                            $signup_psw_confirm.next().css("visibility", "visible").html(data.message);
                        }
                    }
                })
            }
        } else {
            !username && $signup_uname.next().css("visibility", "visible").html("用户名不能为空")
            !password && $signup_psw.next().css("visibility", "visible").html("密码不能为空")
            !password_confirm && $signup_psw_confirm.next().css("visibility", "visible").html("密码不能为空")
            return false
        }
    });

    // 退出操作
    $(".signout").on("click", function () {
        $.ajax({
            url: "/api/user/signout",
            type: "GET",
            success: function (result) { 
                if (result.code) {
                    window.location.reload();
                }
            }
        })
    });
});