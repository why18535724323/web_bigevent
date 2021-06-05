$(function() {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()

        var m = padZero(dt.getMonth() + 1)

        var d = padZero(dt.getDate())


        var hh = padZero(dt.getHours())

        var mm = padZero(dt.getMinutes())

        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认请求第一页
        cate_id: '', //文章分类 id
        state: '' //文章的发布状态
    }


    initTable()
    initCate()

    // 获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }



    // 初始化文章的分类法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通知 layui 重新渲染表单结构
                form.render()
            }
        })
    }


    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render() 方法来渲染页面结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页条数的选择项

            // 分页发生切换的时候，触发jump回调函数
            // 触发 jump 回调的方式有两种：1.点击页码的时候，会触发jump回调
            // 2.只要调用了   laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                console.log(obj.curr);

                // 把最新的页码值，赋值到 q这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // 根据最新的 q来获取对应的数据类表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式为删除按钮 绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        // 获取到文章的id 
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                        // 当数据删除完成之后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了，则让页码值 -1 之后，
                        // 在重新调用 initTable方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据
                        // 页码值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()

                }
            })

            layer.close(index);
        });
    })

    // 编辑部分
    // 通过代理的形式，为 btn-eidt绑定点击事件

    $('tbody').on('click', '.btn-edit', function(e) {
        e.preventDefault();
        // 跳转到 发布文章页面
        location.href = '/article/art_pub.html'
            // 获取对应 id 的信息 
        var id = $(this).attr('data-id')
            // console.log(id);


        // 发起请求获取对应数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                form.val('formTex', res.data)
                console.log(res.data);
            }
        })
    })
})