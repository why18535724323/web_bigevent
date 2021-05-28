$(function() {
    // 点击去注册账号
    $('#link_reg').on('click', function() {
        $('.longin-box').hide()
        $('.reg-box').show()
    })

    // 点击去登陆
    $('#link_login').on('click', function() {
        $('.longin-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    var layer = layui.layer
        // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 定义了一个叫 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验密码是否一致
        repwd: function(value) {
            // 通过形参拿到确认密码中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次扽鱼的判断
            // 如果判断失败， 则return一个人提示消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })


    // 监听注册表单事件

    $("#form_reg").on('submit', function(e) {
        var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            // 1.阻止表单默认行为
        e.preventDefault();
        //  2.发起ajax 的 post 请求 
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功，请登录！");
            // 模拟人的点击行为 给去登陆设置点击事件
            $("#link_login").click();
        })
    })

    // 监听登录表单事件
    $("#form_login").on('submit', function(e) {
        // 阻止默认提交事件
        e.preventDefault();
        //  发起ajax的post请求
        $.ajax({

            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功！')

                // 将登录成功得到的 token 字符串， 保存到 localStorage 中
                localStorage.setItem('token', res.token)
                    // console.log(res.token);
                location.href = '/index.html'
            }
        })

    })
})