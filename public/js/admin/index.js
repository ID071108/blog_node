/**
* created by shuwang on 2018/5/5
* 分类管理
*/

// dom加载完成执行
$(function () {
    /**
     * 添加分类类别
    */
    $(".category_add > input[type=submit]").on("click", function () {
        var val = $(".category_add > input[type=text]").val();
        $.ajax({
            url: "/admin/category/add",
            data: {
                type: val
            },
            dataType: "json",
            type: "POST",
            success: function (rs) {
                var _category_add_msg = $(".category_add > .category_add_msg")[0];
                _category_add_msg.innerHTML = rs.message;
                let timer;
                timer = setTimeout(function () {
                    _category_add_msg.innerHTML = "";
                    timer = null;
                }, 2000);
            }
        })
    });
    /**
     * 分类编辑
     * 
    */
    // 分类编辑ajax请求
    /**
    * 分类编辑ajax请求
    * @param type: 请求类型
    * @param data: 请求参数
    * @param cb: 请求成功的回调函数
    * */
    function category_edit_ajax(type, data, cb) {
        $.ajax({
            url: "/admin/category/edit",
            type: type,
            data: data,
            dataType: "json",
            success: function (res) {
                // 打开并设置当前页面的模态框
                cb(res);
            }
        });
        return false;
    }
    $(".category_index .table-hover button").on("click", function (e) {
        var $btn = $(this);
        var $class = $btn.attr("class");
        var $id = $btn.parent().prev().prev().html();
        var $modal = $(".category_index .modal");
        var $currVal = $modal.find(".currVal")[0];
        var $newVal = $modal.find(".newVal")[0];
        var $modal_msg = $modal.find(".msg")[0];
        // 默认清空一次当前的模态框
        $modal.slideUp(100);
        if ($class.indexOf("btn_modify") !== -1) {
            category_edit_ajax(
                "get",
                {
                    id: $id
                },
                function (res) {
                    $modal.slideDown(100);
                    $currVal.value = res.data.type;
                    $newVal.value = res.data.type;

                    $(".modal > .btn").on("click", function (e) {
                        var _newVal = $newVal.value;
                        category_edit_ajax(
                            "post",
                            {
                                id: $id,
                                type: _newVal
                            },
                            function (res) {
                                $modal_msg.innerHTML = res.message;
                                if (res.code) {
                                    window.location.reload();
                                }
                            }
                        );
                    });
                }
            );
        }
        /**
         * 分类编辑 -删除
         * 
        */
        if ($class.indexOf("btn_delete") !== -1) {
            $.ajax({
                url: "/admin/category/delete",
                type: "get",
                data: {
                    id: $id
                },
                dataType: "json",
                success: function (res) {
                    if (res.code) {
                        window.location.reload();
                    }
                    else {
                        console.log("删除失败");
                    }
                }
            });
        }
    });
    /**
     * 添加内容
    */
    // 验证输入标题栏
    function validate_input(input) {
        var val = $(input).val().trim();
        if (!val) {
            $(input).next().show().html("请输入标题");
        }
        else {
            $(input).next().hide().html("");
        }
        return val;
    }
    // 标题栏输入事件
    $(".content_add #content_add_title").on("change", function (e) {
        var _bool = validate_input(e.target);
        return _bool;
    });
    // 标题栏失焦事件
    $(".content_add #content_add_title").on("blur", function (e) {
        var _bool = validate_input(e.target);
        return _bool;
    });
    // 表单提交事件
    $(".content_add form").on("submit", function () {
        var $form = $(this);
        var $modal = $form.next();
        var $input = $form.find("#content_add_title")[0];
        // 要保存到数据库的数据
        var data = {}
        data.type = $form.find("#content_add_type")[0].value;
        data.title = $form.find("#content_add_title")[0].value;
        data.descript = $form.find("#content_add_descript")[0].value;
        data.content = $form.find("#content_add_content")[0].value;
        // 检查标题是否为空，返回布尔值
        var _bool = validate_input($input);
        if (_bool) {
            $.ajax({
                url: "/admin/content/add",
                type: "post",
                data: data,
                dataType: "json",
                success: function (res) {
                    // 打开并设置当前页面的模态框
                    $form.slideUp(100, function () {
                        $modal.slideDown(100);
                    });
                }
            });
        }
    });
    /**
    * 添加内容
   */
    // 标题栏输入事件
    $(".content_edit #content_add_title").on("change", function (e) {
        var _bool = validate_input(e.target);
        return _bool;
    });
    // 标题栏失焦事件
    $(".content_edit #content_add_title").on("blur", function (e) {
        var _bool = validate_input(e.target);
        return _bool;
    });
    // 表单提交事件
    $(".content_edit form").on("submit", function () {
        var $form = $(this);
        var $modal = $form.next();
        var $input = $form.find("#content_add_title")[0];
        var data = {}
        $(this).serialize().split("&").map(function (v, k) {
            var arr = v.split("=");
            data[arr[0]] = arr[1];
        });
        data.id = window.location.search.split("?")[1].split("=")[1];
        var _bool = validate_input($input);
        if (_bool) {
            $.ajax({
                url: "/admin/content/edit",
                type: "post",
                data: data,
                dataType: "json",
                success: function (res) {
                    // 打开并设置当前页面的模态框
                    $form.slideUp(100, function () {
                        $modal.slideDown(100);
                    });
                }
            });
        }
    });
    // 删除内容
    $(".content_index .btn.btn_delete > a").on("click", function () {
        var id = $(this).attr("data-id");
        $.ajax({
            url: "/admin/content/delete",
            type: "get",
            data: {
                id: id
            },
            dataType: "json",
            success: function (res) {
                res.code && window.location.reload();
            }
        });
    });
});