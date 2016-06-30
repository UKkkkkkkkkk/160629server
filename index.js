list()

var getUserRow = function(user){
    return `<tr id="tr_${user.id}"><td>${user.id}</td>
                         <td>${user.name}</td>
                         <td>
                         <button onclick="del(${user.id})" class="btn btn-danger">删除</button>
                         </td>
                      </tr>`;
}



//读取后台接口，得到左右的用户列表，并加到表格中
function list(){
    $.get('/users').success(function (result) {
        //先得到用户数组
        var users = result.data;
        //对数组中的元素进行迭代
        var html = '';
        $.each(users, function (index, item) {
            html += getUserRow(item);
        });
        $('#userList').html(html);
    });
}


function add(){
    $('#userModal').modal('show');//显示模态窗口
}



function save(){
    var name = $('#name').val(); //取得用户名
    var user = {name:name};      //组装要传到后台的对象
    console.log(name,user);
    $.post('/users',user).success(function(result){
        var code = result.code;
        if(code == 'ok'){
            var user = result.data;
            $('#userList').append(getUserRow(user));
            $('#name').val('');
            $('#alert').html('操作成功');
            $('#userModal').modal('hide');//隐藏
        }else{
            $('#alert').html('操作失败');
        }
    });
}




function del(id){
    console.log(1);
  $.ajax({
      url:`/users?id=${id}`,
      method:"DELETE",
      data:{id:id},
      processData:true//处理数据，会将data对象，转成查询字符串放在接口url 后面
  }).success(function (result) {
      var user=result.user;
      var code=result.code;
      console.log(code);
      if(code == "error"){
          $('#alert').html("操作失败");
      }else{
          $(`#tr_${id}`).remove();
      }
  })
}


function updata(id){
    $.get(`/user?id=${id}`).success(function (result) {
        var user=result.data;
        $("#name").val(user.name);
        $("#userId").val(user.id);
        $('#userModal').modal('show');//显示
    })
}