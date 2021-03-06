define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'user/user_apply/index' + location.search,
                    add_url: 'user/user_apply/add',
                    edit_url: 'user/user_apply/edit',
                    del_url: 'user/user_apply/del',
                    multi_url: 'user/user_apply/multi',
                    import_url: 'user/user_apply/import',
                    table: 'user_apply',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'user_id', title: __('User_id')},
                        {field: 'the_name', title: __('The_name'), operate: 'LIKE'},
                        // {field: 'gender', title: __('Gender')},
                        {
                            field: 'gender',
                            title: __('Gender'),
                            table: table,
                            // custom: {"0": 'success', "1": 'danger'},
                            searchList: {"0": __('Gender 0'), "1": __('Gender 1')},
                            formatter: Table.api.formatter.status
                        },
                        {field: 'mobile', title: __('Mobile'), operate: 'LIKE'},
                        {field: 'home_address', title: __('Home_address'), operate: 'LIKE'},
                        {field: 'management_area', title: __('Management_area'), operate: 'LIKE'},
                        {field: 'lng', title: __('Lng'), operate: 'LIKE'},
                        {field: 'lat', title: __('Lat'), operate: 'LIKE'},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1'),"2":__('State 2')}, formatter: Table.api.formatter.normal},
                        // {field: 'user.id', title: __('User.id')},
                        {field: 'user.nickname', title: __('User.nickname'), operate: 'LIKE'},
                        // {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                        //操作栏,默认有编辑、删除或排序按钮,可自定义配置buttons来扩展按钮
                        {
                            field: 'operate',
                            width: "150px",
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                              
                                {
                                        name:  'click',
                                        text:  '同意',
                                        title: '同意',
                                        url: 'user/user_apply/editState/state/1',
                                        classname: 'btn btn-xs  btn-success btn-ajax',
                                        click: function (data,row) {
                                            Layer.alert("接收到回传数据：" + JSON.stringify(data), {title: "回传数据"});
                                        },
                                        hidden:function(row){
                                            console.log(row.state);
                                            if(row.state == "0" ){ 
                                                return false;
                                            }
                                            return true;
                                        }
                                },
                                {
                                    name:  'click',
                                    text:  '拒绝',
                                    title: '拒绝',
                                    url: 'user/user_apply/editState/state/2',
                                    classname: 'btn btn-xs  btn-danger btn-ajax',
                                    click: function (data,row) {
                                        Layer.alert("接收到回传数据：" + JSON.stringify(data), {title: "回传数据"});
                                    },
                                    hidden:function(row){
                                        console.log(row.state);
                                        if(row.state == "0" ){ 
                                            return false;
                                        }
                                        return true;
                                    }
                            },
                            ],
                            formatter: Table.api.formatter.operate
                        },
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        map: function () {
            Form.api.bindevent($("form[role=form]"));
            require(['async!BMap3'], function () {
                // 更多文档可参考 http://lbsyun.baidu.com/jsdemo.htm
                // 百度地图API功能
                var map = new BMap.Map("allmap");
                var point = new BMap.Point(116.404, 39.915);//精度，纬度

                map.centerAndZoom(point, 20); //设置中心坐标点和级别
                var marker = new BMap.Marker(point);  // 创建标注
                map.addOverlay(marker);               // 将标注添加到地图中
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

                map.enableDragging();   //开启拖拽
                //map.enableInertialDragging();   //开启惯性拖拽
                map.enableScrollWheelZoom(true); //是否允许缩放
                //map.centerAndZoom("上海",15); //根据城市名设定地图中心点

                function G(id) {
                    return document.getElementById(id);
                }

                var ac = new BMap.Autocomplete(//建立一个自动完成的对象
                        {"input": "searchaddress"
                            , "location": map
                        });

                ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
                    var str = "";
                    var _value = e.fromitem.value;
                    var value = "";
                    if (e.fromitem.index > -1) {
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                    value = "";
                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province + _value.city + _value.district + _value.street + _value.business;
                    }
                    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                    G("searchResultPanel").innerHTML = str;
                });

                var myValue;
                ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
                    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                    setPlace();
                });

                function setPlace() {
                    map.clearOverlays();    //清除地图上所有覆盖物
                    function myFun() {
                        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                        map.centerAndZoom(pp, 18);
                        map.addOverlay(new BMap.Marker(pp));    //添加标注
                    }
                    var local = new BMap.LocalSearch(map, {//智能搜索
                        onSearchComplete: myFun
                    });
                    local.search(myValue);
                }
                //单击获取点击的经纬度
                var geoc = new BMap.Geocoder();
                map.addEventListener("click", function (e) {
                    var pt = e.point;
                    geoc.getLocation(pt, function (rs) {
                        var addComp = rs.addressComponents;
                        Layer.alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber + " <br> "
                                + __('Longitude') + ' : ' + e.point.lng + ' , ' + __('Latitude') + ' : ' + e.point.lat);
//                        console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber + " <br> "
//                                + __('Longitude') + ' : ' + e.point.lng + ' , ' + __('Latitude') + ' : ' + e.point.lat);

                    });
                });
//
//                // 点搜索按钮时解析地址坐标
//                $(document).on('click', '.btn-search', function () {
//                    var local = new BMap.LocalSearch(map, {
//                        renderOptions: {map: map}
//                    });
//                    var searchkeyword = $("#searchaddress").val();
//                    local.search(searchkeyword);
//                });

            });
        },
        /* api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        } */
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
                var default_zoom = 10;
                var find_zoom = 18;
                require(['async!BMap3'], function () {

                    var longitude = $("#c-longitude").val();
                    var latitude = $("#c-latitude").val();
                    // 百度地图API功能
                    var map = new BMap.Map("allmap");
                    var point;
                    if (longitude == "") {
                        point = new BMap.Point(116.404, 39.915);
                        map.centerAndZoom(point, default_zoom);
                    } else {
                        point = new BMap.Point(longitude, latitude);
                        map.centerAndZoom(point, find_zoom);
                        marker = new BMap.Marker(point);  // 创建标注
                        map.addOverlay(marker);               // 将标注添加到地图中
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    }

                    var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
                    map.addControl(top_left_navigation);

                    // 创建地址解析器实例
                    var myGeo = new BMap.Geocoder();
                    map.addEventListener("click", function (e) {
                        var pt = e.point;
                        myGeo.getLocation(pt, function (rs) {
                            var addComp = rs.addressComponents;
                            $("#c-longitude").val(pt.lng);
                            $("#c-latitude").val(pt.lat);
                            $("#c-province").val(addComp.province);
                            Layer.msg(__('Position update') + ' <br> ' + __('Longitude') + ' : ' + pt.lng + ' , ' + __('Latitude') + ' : ' + pt.lat);

                            map.clearOverlays();
                            marker = new BMap.Marker(pt);  // 创建标注
                            map.addOverlay(marker);               // 将标注添加到地图中
                            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                        });
                    });

                    function G(id) {
                        return document.getElementById(id);
                    }

                    var ac = new BMap.Autocomplete(//建立一个自动完成的对象
                            {"input": "searchaddress"
                                , "location": map
                            });

                    var myValue;
                    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                        var _value = e.item.value;
                        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                        setPlace();
                    });

                    function setPlace() {
                        map.clearOverlays();    //清除地图上所有覆盖物
                        function myFun() {
                            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                            myGeo.getLocation(pp, function (rs) {
                                var addComp = rs.addressComponents;
                                $("#c-longitude").val(pp.lng);
                                $("#c-latitude").val(pp.lat);
                                $("#c-province").val(addComp.province);
                                map.centerAndZoom(pp, find_zoom);
                                marker = new BMap.Marker(pp);  // 创建标注
                                map.addOverlay(marker);               // 将标注添加到地图中
                                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                                Layer.msg(__('Position update') + ' <br> ' + __('Longitude') + ' : ' + pp.lng + ' , ' + __('Latitude') + ' : ' + pp.lat);
                            });
                        }
                        var local = new BMap.LocalSearch(map, {//智能搜索
                            onSearchComplete: myFun
                        });
                        local.search(myValue);
                    }
                })

            }
        }
    };
    return Controller;
});