$(function() {

    var layer = layui.layer
    var form = layui.form

    initArtCateLise()
        // 获取文章分类的列表
    function initArtCateLise() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮 绑定点击事件
    var indexAdd = null
    $('#btnAddcate').on('click', function() {
        indexAdd = layer.open({
            type: 1, //把确定按钮干掉
            area: ['500px', '250px'], //弹出层的宽 高
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })


    // 通过代理的形式，为 form-add  表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateLise()
                layer.msg('获取分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为 btn-eidt绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e) {
        e.preventDefault();

        indexEdit = layer.open({
            type: 1, //把确定按钮干掉
            area: ['500px', '250px'], //弹出层的宽 高
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        var id = $(this).attr('data-id')
            // console.log(id);

        // 发起请求获取对应数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功!')
                layer.close(indexEdit)
                initArtCateLise()
            }
        })
    })

    // 通过代理的形式，给删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')

        // 提示用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    initArtCateLise()
                }
            })


        });
    })
})