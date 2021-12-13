from genericpath import exists
import os
import io
import cv2
import json
import random
import string
from itsdangerous.encoding import base64_encode

from werkzeug.utils import secure_filename
from ida_app import create_app
import pymysql
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from ida_app import token
from PIL import Image
import base64
#connect database数据库mysql 
# #可以在mysql建立datatagger数据库然后复制schema.sql的SQL语句建立表 
# 数据库密码放自身MySQL的密码
db = pymysql.connect(host="127.0.0.1", 
                port=3306, user="root",
                password="yuan2312162", 
                database="datatagger",
                charset='utf8' )
cursor = db.cursor()

app = create_app()
CORS(app, resources=r'/*')


@app.route('/')
def index():
    #test
    sql = "SELECT * FROM user"
    cursor.execute(sql)
    data = cursor.fetchone()
    print(data)
    return 'Hello World test test test'

#虚拟路径
@app.route('/images/multi-upload', methods=['POST'])

#用户登录
@app.route('/user/login',methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        jsondata = request.get_json()
        name = jsondata["username"]
        password = jsondata["password"]
        print(name,password)
        code = 0
        msg = "登录成功"
        cursor.execute("select id,name from user where name = '%s'" % (name))
        data1 = cursor.fetchone()
        print(data1)
        cursor.execute("select password from user where name = '%s' and password = '%s'" %(name,password))
        data2 = cursor.fetchone()
        or_word = "or"
        if or_word in str(password).lower():
            print("or word exist")
            data2 = None
        #print(data1[0],data1[1],data2,sep="---")
        if data1 is None:
            print("name not match")
            code = -1
            msg = "用户不存在,请重新登录!"
            return jsonify(code=code,msg=msg)
        if data2 is None:
            print("password not match")
            code = -2
            msg = "密码错误,请重新登录!"
            return jsonify(code=code, msg=msg)
        token_back = token.create_token(data1[0])
        #token_bb = token.verify_token(token_back)
        #print(token_back, token_bb, sep="======")
        #print(type(token_back))
        code = 1
        msg = "用户 " + name + " 登录成功!"
        jsondata = {"id":data1[0],"name":data1[1],"token":token_back}
        return jsonify(code=code,msg=msg,data=jsondata)
    elif request.method=="GET":
        print("get method")
        jsondata={}
        return jsonify(jsondata)
    else:
        print("error")
        jsondata={}
        return jsonify(jsondata)

#用户注册
@app.route('/user/register', methods=['POST'])
def register():
    if  request.method == "POST" :
        #print("form:", request.get_json())
        jsondata = request.get_json()
        name = jsondata["name"]
        password = jsondata["password"]
        email = jsondata["email"]
        phone = jsondata["phone"]
        #print(name, password , email, phone, sep="--")
        cursor.execute("SELECT name FROM USER WHERE name = '%s'" % name)
        data = cursor.fetchone()
        #print(data)
        #if username exists
        if data is not None: 
            print("name exists")
            return "-1"
        
        cursor.execute("SELECT email from user where email = '%s'" % email)
        data = cursor.fetchone()
        #print(data)
        #if email exist
        if data is not None:
            print("email exists")
            return "-2"
        
        try:
            cursor.execute("insert into user (name,password,email,phone) values('%s','%s','%s','%s')" % (name,password,email,phone))
            db.commit() #commit to database
            return "1" #success

        except Exception as e: #if got exception means error
            print("Exception : " , e)
            db.rollback() #if error then rollback to database
            return "-3"
    else : #else not post method
        return "-4"

#user check email for forget password
@app.route('/user/checkemail',methods=['POST'])
def checkUserEmail():
    jsondata = request.get_json()
    email = jsondata["email"]
    #print(jsondata,email)
    cursor.execute("select id from user where email='%s'" % email)
    data = cursor.fetchone()
    if data is None:
        code = -1
        msg = "用户邮箱不存在，请重新输入!"
        return jsonify(code=code,msg=msg)
    code = 1
    msg = "用户邮箱存在，请重置密码!"
    return jsonify(code=code,msg=msg)

#user forget password
@app.route('/user/forgetpw',methods=['POST'])
def userForgetPW():
    jsondata = request.get_json()
    #print(jsondata)
    email = jsondata["email"]
    password = jsondata["password"]
    code = 0
    msg = ""
    try:
        cursor.execute("Update user set password='%s' where email = '%s'" % (password, email))
        db.commit()
        code = 1
        msg = "用户密码修改成功!"
        return jsonify(code=code,msg=msg)
    except Exception as e: #if got exception means error
        print("Exception : " , e)
        db.rollback() #if error then rollback to database
        code = -1
        msg = "用户修改密码出错，请重新修改个人信息!"
        return jsonify(code=code,msg=msg)

#get user info 获取用户的个人信息
@app.route('/user/info/<token_id>',methods=['GET'])
def getUserInfo(token_id):
    if request.method=="GET":
        userid = token.verify_token(token_id)
        cursor.execute("Select * from user where id = '%s'" % userid)
        data = cursor.fetchone()
        if data is None:
            print("user does not exist")
            code = -1
            msg = "用户不存在"
            return jsonify(code=code, msg=msg)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = 1
        msg = "用户存在"
        jsondata = request.get_json()
        jsondata = {"name":data[1],"password":data[2],"email":data[3],"phone":data[4]}
        return jsonify(code=code,msg=msg,data=jsondata)
    else:
        print("error get")
        jsondata={}
        return jsonify(jsondata)

#edit user info 修改用户信息
@app.route('/user/info/edit', methods=['POST'])
def editUserInfo():
    jsondata = request.get_json()
    print(jsondata)
    name = jsondata["name"]
    email = jsondata["email"]
    phone = jsondata["phone"]
    try:
        cursor.execute("Update user set email='%s', phone='%s'  where name = '%s'" % (email, phone, name))
        db.commit()
        code = 1
        msg = name + " 用户个人信息修改成功!"
        return jsonify(code=code,msg=msg)
    except Exception as e: #if got exception means error
        print("Exception : " , e)
        db.rollback() #if error then rollback to database
        code = -1
        msg = "用户邮箱已存在，请重新修改个人信息!"
        return jsonify(code=code,msg=msg)

#edit user password 修改密码
@app.route('/user/info/editpassword', methods=['POST'])
def editUserPassword():
    jsondata = request.get_json()
    #print(jsondata)
    name = jsondata["name"]
    oldpassword = jsondata["old"]
    password = jsondata["password"]
    cursor.execute("select id from user where name='%s' and password='%s'" % (name,oldpassword))
    data = cursor.fetchone()
    if data is None:
        code = -1
        msg = "旧密码不正确，请重新修改个人密码!"
        return jsonify(code=code,msg=msg)
    else :
        try:
            cursor.execute("Update user set password='%s' where name = '%s'" % (password, name))
            db.commit()
            code = 1
            msg = name + " 用户密码修改成功!"
            return jsonify(code=code,msg=msg)
        except Exception as e: #if got exception means error
            print("Exception : " , e)
            db.rollback() #if error then rollback to database
            code = -2
            msg = "用户修改密码出错，请重新修改个人信息!"
            return jsonify(code=code,msg=msg)

#convert to binary
def convertToBinaryData(filename):
    # Convert digital data to binary format
    with open(filename, 'rb') as file:
        binaryData = file.read()
    return binaryData

#write binary to file
def write_file(data, filename):
    # Convert binary data to proper format and write it on Hard Disk
    with open(filename, 'wb') as file:
        file.write(data)

#check same filename exist in the folder or not
def checkFileExist(filename):
    filepath = "../front-end/src/uploadimage/"
    filename = "POST_" + filename
    fp = filepath + filename 
    while(os.path.exists(fp) == True):
        fp = filepath + filename.split('.')[0] + "(1)." + filename.split('.')[1]
        filename = filename.split('.')[0] + "(1)." + filename.split('.')[1]
    return filename

#insert image into database / post task 插入任务信息和图片名
@app.route('/user/task/postimage', methods=['POST','GET'])
def userPostImageTask():
    tokenid = request.form.get("id")
    id = token.verify_token(tokenid)
    username = request.form.get("username")
    taskname = request.form.get("taskname")
    description = request.form.get("description")
    datetime = request.form.get("datetime")
    timestamp = request.form.get('timestamp')
    file = request.files.getlist("files")
    status = 0
    img = [pymysql.NULL]*10
    code = -2
    msg = ""
    fp = "../front-end/src/uploadimage/"
    i = 0 
    for f in file:
        fn = checkFileExist(f.filename)
        fp = fp + fn
        f.save(fp)
        img[i] = fn
        i = i + 1
        fp = "../front-end/src/uploadimage/"
        #print("123456", fn, "123", fp,"www" , i)
    print(img)
    print(taskname,id,username,description,datetime,status,sep="...")
    sql = "insert into image (taskname,userid,username,description,datetime,status,image1,image2,image3,image4,image5,image6,image7,image8,image9) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    tuple = (taskname, id, username,description, datetime, status, img[0],img[1],img[2],img[3],img[4],img[5],img[6],img[7],img[8])
    try:
        cursor.execute(sql,tuple)
        db.commit() #submit to mysql
        code = 1
        msg = "用户发布图像任务成功!"
        return jsonify(code=code,msg=msg)
    except Exception as e:
        print(e)
        db.rollback()
        code = -1
        msg = "数据库输入无效，请重新发布任务"
        #if cant insert database then remove the image in the local folder
        i = 0
        while(img[i] != pymysql.NULL):
            tempfp = "../front-end/src/uploadimage/"
            temp = tempfp + img[i]
            print(temp)
            if os.path.exists(temp):
                os.remove(temp)
            i = i + 1

    return jsonify(code=code,msg=msg)

#rand string of number lower uppercase 
def rand_string(length):
	rand_str = ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for i in range(length))
	return rand_str
#return length of video
def length_of_video(video_path):
	cap = cv2.VideoCapture(video_path)
	length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
	return length

#extract frame
def extracting_frames(video_path, save_path, fn, skip_frames):
    print("extract video to image ")
    _,file_name = os.path.split(video_path)
    file_name_without_ext = os.path.splitext(file_name)[0]
    length = length_of_video(video_path)
    if length == 0:
        print("video length is 0")
        return 0
    print(length)
    cap = cv2.VideoCapture(video_path)
    count = 0
    random_string = rand_string(5)
    #testing
    ret,frame = cap.read()
    test_file_path = os.path.join(save_path,file_name_without_ext[:6] + \
        '{}_{}.jpg'.format(random_string,count))
    print(file_name_without_ext)
	#cv2.imwrite(test_file_path,frame)
    if os.path.isfile(video_path):
        #print("saving test frame success")
        j = 0
        tempimgfile = [pymysql.NULL]*9
        count = 1
        while ret:
            ret,frame = cap.read()
            if ret and count % skip_frames == 0 :
                cv2.imwrite(os.path.join(save_path,file_name_without_ext[:5] + '{}_{}.jpg'.format(fn,count)),frame)
                temp = os.path.join(save_path,file_name_without_ext[:5] + '{}_{}.jpg'.format(fn,count))
                tempimgfile[j] = temp.split('/')[4]
                j += 1
                count += 1
                print(count, tempimgfile[j-1],sep="....")
            else:
                count += 1
    else :
        print("cannot save file")   
        return 0
    cap.release()
    print("Finish")
    return tempimgfile

def checkVideoExist(filename):
    filepath = "../front-end/src/uploadvideo/"
    filename = "POST_" + filename
    fp = filepath + filename 
    while(os.path.exists(fp) == True):
        fp = filepath + filename.split('.')[0] + "(1)." + filename.split('.')[1]
        filename = filename.split('.')[0] + "(1)." + filename.split('.')[1]
    return filename

@app.route('/user/task/postvideo',methods=['POST'])
def userPostVideoTask():
    code = 0
    msg = ""
    fp = "../front-end/src/uploadvideo/"
    savefp = "../front-end/src/uploadimage/"
    tokenid = request.form.get("id")
    id = token.verify_token(tokenid)
    username = request.form.get("username")
    taskname = request.form.get("taskname")
    description = request.form.get("description")
    datetime = request.form.get("datetime")
    file  = request.files.get("files")
    status = 0
    print(file)
    if file is not None : 
        fn = checkVideoExist(file.filename)
        tempfp = fp + fn
        file.save(tempfp)
    fn = fn.split('_')[1]
    fn = fn.split('.')[0]
    print(tempfp,fp,fn,sep=" ... ")
    lens = length_of_video(tempfp)
    tempskipframe = int(lens / 9)
    #print(tempskipframe)
    img = [pymysql.NULL]*9
    #full file path, save at which file path ,filename without POST_ words ,skip frame
    img = extracting_frames(tempfp, savefp, fn, skip_frames=tempskipframe)
    print(img)
    print(taskname,id,username,description,datetime,status,sep="...")
    sql = "insert into image (taskname,userid,username,description,datetime,status,image1,image2,image3,image4,image5,image6,image7,image8,image9) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    tuple = (taskname, id, username,description, datetime, status, img[0],img[1],img[2],img[3],img[4],img[5],img[6],img[7],img[8])
    try:
        cursor.execute(sql,tuple)
        db.commit() #submit to mysql
        code = 1
        msg = "视频已生成转换为图片，用户发布视频任务成功!"
        return jsonify(code=code,msg=msg)
    except Exception as e:
        print(e)
        db.rollback()
        code = -1
        msg = "数据库输入无效，请重新发布任务"
        #if cant insert then remove video in the local folder
        if os.path.exists(tempfp):
            os.remove(tempfp)
        #if cant insert database then remove the image in the local folder
        i = 0
        while(img[i] != pymysql.NULL):
            temp_fp = "../front-end/src/uploadimage/"
            temp = temp_fp + img[i]
            print(temp)
            if os.path.exists(temp):
                os.remove(temp)
            i = i + 1
    return jsonify(code = code, msg=msg)

#获取全网任务里发布的任务
@app.route('/tasklist/postlist',methods=['GET'])
def getTaskList():
    if request.method=="GET":
        status = 0
        temp = {}
        result = []
        #cursor.execute("Select taskname, username,description,datetime from image where status = '%s'" % status)
        cursor.execute("select id,taskname,username,description, datetime,"\
            "image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where status = '%s' order by datetime desc" , status)
        
        data = cursor.fetchall()
        if data is not None:
            for x in data:
                temp["imageid"] = x[0]
                temp["taskname"] = x[1]
                temp["username"] = x[2]
                temp["description"] = x[3]
                temp["datetime"] = x[4]
                temp["image1"] = x[5]
                temp["image2"] = x[6]
                temp["image3"] = x[7]
                temp["image4"] = x[8]
                temp["image5"] = x[9]
                temp["image6"] = x[10]
                temp["image7"] = x[11]
                temp["image8"] = x[12]
                temp["image9"] = x[13]
                result.append(temp.copy())
                #print(result)
            print(len(data),"Task exists")
            code = 1
            msg = "仍有"+str(len(data))+"项发布任务未领取"
            return jsonify(code=code, msg=msg, result=result)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = -1
        msg = "没有人发布任务"
        return jsonify(code=code,msg=msg)
    else:
        print("error post")
        jsondata={}
        return jsonify(jsondata)

#获取全网任务里已领取的任务
@app.route("/tasklist/receivelist",methods=['GET'])
def receivetasklist():
    if request.method=="GET":
        status = 1
        temp = {}
        result = []
        #cursor.execute("Select taskname, username,description,datetime from image where status = '%s'" % status)
        cursor.execute("select id,taskname,username,receiveusername,description, datetime,"\
            "image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where status = '%s' order by datetime desc" , status)
        data = cursor.fetchall()
        if len(data) != 0:
            for x in data:
                temp["imageid"] = x[0]
                temp["taskname"] = x[1]
                temp["username"] = x[2]
                temp["receiveusername"] = x[3]
                temp["description"] = x[4]
                temp["datetime"] = x[5]
                temp["image1"] = x[6]
                temp["image2"] = x[7]
                temp["image3"] = x[8]
                temp["image4"] = x[9]
                temp["image5"] = x[10]
                temp["image6"] = x[11]
                temp["image7"] = x[12]
                temp["image8"] = x[13]
                temp["image9"] = x[14]
                result.append(temp.copy())
                #print(result)
            print(len(data),"Task exists")
            code = 1
            msg = "待完成的任务:"+str(len(data))+"项"
            return jsonify(code=code, msg=msg, result=result)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = -1
        msg = "没有人领取任务"
        return jsonify(code=code,msg=msg)
    else:
        print("error post")
        jsondata={}
        return jsonify(jsondata)


#获取全网任务里的已完成任务
@app.route("/tasklist/completelist",methods=['GET'])
def completetasklist():
    if request.method=="GET":
        status1 = 2
        status2 = 3
        temp = {}
        result = []
        #cursor.execute("Select taskname, username,description,datetime from image where status = '%s'" % status)
        cursor.execute("select id,taskname,username,receiveusername,description, datetime,status,"\
            "image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where status = '%s' or status = '%s' order by datetime desc" , (status1,status2))
        #image可能就不select了
        data = cursor.fetchall()
        if len(data) != 0:
            for x in data:
                temp["imageid"] = x[0]
                temp["taskname"] = x[1]
                temp["username"] = x[2]
                temp["receiveusername"] = x[3]
                temp["description"] = x[4]
                temp["datetime"] = x[5]
                temp["status"] = x[6]
                temp["image1"] = x[7]
                temp["image2"] = x[8]
                temp["image3"] = x[9]
                temp["image4"] = x[10]
                temp["image5"] = x[11]
                temp["image6"] = x[12]
                temp["image7"] = x[13]
                temp["image8"] = x[14]
                temp["image9"] = x[15]
                result.append(temp.copy())
                #print(result)
            print(len(data),"Task exists")
            code = 1
            msg = "已完成的任务:"+str(len(data))
            return jsonify(code=code, msg=msg, result=result)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = -1
        msg = "没有人完成任务"
        return jsonify(code=code,msg=msg)
    else:
        print("error post")
        jsondata={}
        return jsonify(jsondata)

#别的用户发布任务后，其他用户来领取任务
#/user/task/(postimage或postvideo或receive或complete或delete) 或 /admin/task/verify管理员审核任务成功
@app.route('/user/task/receive', methods=['POST'])
def userReceiveTask():
    tokenid = request.form.get("id")
    userid = token.verify_token(tokenid)
    username = request.form.get("username")
    imageid = request.form.get("imageid")
    status = 1
    #print(userid,username,imageid,status,sep="...")
    cursor.execute("select username from image where id='%s'" % imageid)
    data = cursor.fetchone()
    #print("eee ",data)
    if data is not None:
        if(data[0] == username):
            print("same user can't receive self post task")
            code=-2
            msg="发布人不能领取自己的任务,请重新领取其他人的任务!"
            return jsonify(code=code,msg=msg)
    try:
        cursor.execute("Update image set receiveuserid='%s', receiveusername='%s', status='%s' where id = '%s' " % (userid,username,status,imageid))
        db.commit()
        code=1
        msg="用户 " + username + " 成功领取任务!"
        return jsonify(code=code,msg=msg)
    except Exception as e:
        print(e)
        code=-1
        msg="数据库输入错误,请重新领取任务"
        db.rollback()
        return jsonify(code=code,msg=msg)    

#check the upload complete image is same filename exist in the folder or not
def checkFileExist2(filename):
    filepath = "../front-end/src/uploadimage/"
    filename = "COMPLETE_" + filename
    fp = filepath + filename 
    while(os.path.exists(fp) == True):
        fp = filepath + filename.split('.')[0] + "(1)." + filename.split('.')[1]
        filename = filename.split('.')[0] + "(1)." + filename.split('.')[1]
    return filename

#用户领取任务后，提交任务以完成任务
@app.route('/user/task/complete',methods=['POST'])
def userCompleteTask():
    tokenid = request.form.get("id")
    id = token.verify_token(tokenid)
    username = request.form.get("username")
    imageid = request.form.get("imageid")
    file = request.files.getlist("files")
    images = request.form.getlist("images")
    lens = 0
    cursor.execute("select image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where id = '%s'" % imageid)
    data = cursor.fetchone()
    for x in data:
        if(x != pymysql.NULL): lens = lens+1
    #如果上传的图片个数与发布任务的图片个数不同则不能提交任务，必须个数相同
    if(len(file) != lens):
        code = -2
        msg = "上传的图片个数与发布的图片个数不同,请重新提交任务!"
        return jsonify(code=code,msg=msg)
    status = 2
    img = [pymysql.NULL]*10
    code = -2
    msg = ""
    fp = "../front-end/src/uploadimage/"
    i = 0 
    for f in file:
        fn = checkFileExist2(f.filename)
        fp = fp + fn
        f.save(fp)
        img[i] = fn
        i = i + 1
        fp = "../front-end/src/uploadimage/"
    sql = "update image set status='%s',image1='%s',image2='%s',image3='%s',image4='%s',image5='%s',image6='%s',image7='%s',image8='%s',image9='%s' where id = '%s'"
    tuple = (status,img[0],img[1],img[2],img[3],img[4],img[5],img[6],img[7],img[8],imageid)
    try:
        cursor.execute(sql % tuple)
        db.commit()
        code = 1
        msg = "用户 " + username + " 提交任务，成功完成任务!"
        lens = len(images)
        #delete the post task image
        for j in range(lens):
            tempfp = "../front-end/src/uploadimage/"
            print("image j : ", images[j])
            temp = tempfp + images[j]
            if os.path.exists(temp):
                os.remove(temp)
                print("remove successfully")
        return jsonify(code=code,msg=msg)
    except Exception as e:
        print(e)
        db.rollback()
        code = -1
        msg = "数据库输入无效，请重新提交任务"
        i = 0
        while(img[i] != pymysql.NULL):
            tempfp = "../front-end/src/uploadimage/"
            temp = tempfp + img[i]
            print(temp)
            if os.path.exists(temp):
                os.remove(temp)
            i = i + 1
    return jsonify(code=code,msg=msg)

#用户删除自己发布的任务
@app.route('/user/task/delete',methods=['POST'])
def userDeleteTask():
    tokenid = request.form.get("id")
    userid = token.verify_token(tokenid)
    username = request.form.get("username")
    imageid = request.form.get("imageid")
    cursor.execute("select image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where id='%s'" % imageid)
    data = cursor.fetchall()
    code = 0
    msg = ""
    fp = "../front-end/src/uploadimage/"
    i = 0
    if data is None:
        print("找不到该发布任务!")
        code=-2
        msg="删除任务出现错误，找不到该项任务，请重新删除任务!"
        return jsonify(code=code,msg=msg)
    try:
        cursor.execute("Delete from image where id = '%s' " % imageid)
        db.commit()
        for x in range(9):
            if(data[0][i] != pymysql.NULL):
                tempfp = fp + str(data[0][i])
                i += 1
                print(x, " : ",tempfp)
                if os.path.exists(tempfp) :
                    os.remove(tempfp)
        code=1
        msg="用户 " + username + " 成功删除任务!"
        return jsonify(code=code,msg=msg)
    except Exception as e:
        print(e)
        code=-1
        msg="数据库输入错误,请重新领取任务"
        db.rollback()
        return jsonify(code=code,msg=msg)    

@app.route('/admin/task/verify',methods=['POST'])
def adminVerifyTask():
    code =0 
    msg = ""
    imageid = request.form.get("imageid")
    name = request.form.get("username")
    if name != "admin":
        code = -2
        msg = "只有管理员能审核任务!"
        return jsonify(code=code,msg=msg)
    status = 3
    try:
        cursor.execute("update image set status = '%s' where id = '%s'" % (status,imageid))
        db.commit()
        code = 1
        msg = "管理员审核任务成功!"
        return jsonify(code=code,msg=msg)
    except Exception as e:
        print(e)
        db.rollback()
        code = -1
        msg = "数据库输入无效，请重新审核任务"
        return jsonify(code=code,msg=msg)


#获取用户个人所发布的任务信息
#/usertask/(postinfo or receiveinfo or completeinfo/<user_name>)
@app.route('/usertask/postinfo/<user_name>',methods=['GET'])
def getUserTaskPostInfo(user_name):
    if request.method=="GET":
        name = user_name
        status = 0
        temp = {}
        result = []
        #cursor.execute("Select taskname, username,description,datetime from image where status = '%s'" % status)
        cursor.execute("select id,taskname,username,receiveusername,description, datetime,"\
            "image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where username='%s' and status='%s' order by datetime desc" % (name,status))
        data = cursor.fetchall()
        if data is not None:
            for x in data:
                temp["imageid"] = x[0]
                temp["taskname"] = x[1]
                temp["username"] = x[2]
                temp["receiveusername"] = x[3]
                temp["description"] = x[4]
                temp["datetime"] = x[5]
                temp["image1"] = x[6]
                temp["image2"] = x[7]
                temp["image3"] = x[8]
                temp["image4"] = x[9]
                temp["image5"] = x[10]
                temp["image6"] = x[11]
                temp["image7"] = x[12]
                temp["image8"] = x[13]
                temp["image9"] = x[14]
                result.append(temp.copy())
                #print(result)
            print(len(data),"Task exists")
            code = 1
            msg = "仍有"+str(len(data))+"项发布任务未领取"
            return jsonify(code=code, msg=msg, result=result)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = -1
        msg = "没有人发布任务"
        return jsonify(code=code,msg=msg)
    else:
        print("error post")
        jsondata={}
        return jsonify(jsondata)

#获取用户个人所领取的任务信息
@app.route('/usertask/receiveinfo/<user_name>',methods=['GET'])
def getUserTaskReceiveInfo(user_name):
    if request.method=="GET":
        name = user_name
        status = 1
        temp = {}
        result = []
        #cursor.execute("Select taskname, username,description,datetime from image where status = '%s'" % status)
        cursor.execute("select id,taskname,username,receiveusername,description, datetime,"\
            "image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where receiveusername='%s' and status='%s' order by datetime desc" % (name,status))
        data = cursor.fetchall()
        print(len(data))
        if len(data) != 0:
            for x in data:
                temp["imageid"] = x[0]
                temp["taskname"] = x[1]
                temp["username"] = x[2]
                temp["receiveusername"] = x[3]
                temp["description"] = x[4]
                temp["datetime"] = x[5]
                temp["image1"] = x[6]
                temp["image2"] = x[7]
                temp["image3"] = x[8]
                temp["image4"] = x[9]
                temp["image5"] = x[10]
                temp["image6"] = x[11]
                temp["image7"] = x[12]
                temp["image8"] = x[13]
                temp["image9"] = x[14]
                result.append(temp.copy())
                #print(result)
            print(len(data),"Task exists")
            code = 1
            msg = "待完成任务:"+str(len(data))+"项"
            return jsonify(code=code, msg=msg, result=result)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = -1
        msg = "未领取任何任务"
        return jsonify(code=code,msg=msg)
    else:
        print("error post")
        jsondata={}
        return jsonify(jsondata)

#获取用户个人所完成的任务信息
@app.route('/usertask/completeinfo/<user_name>',methods=['GET'])
def getUserTaskCompleteInfo(user_name):
    if request.method=="GET":
        name = user_name
        status1 = 2
        status2 = 3
        temp = {}
        result = []
        #cursor.execute("Select taskname, username,description,datetime from image where status = '%s'" % status)
        cursor.execute("select id,taskname,username,receiveusername,description, datetime,status,"\
            "image1,image2,image3,image4,image5,image6,image7,image8,image9 from image where (status='%s' or status='%s') and receiveusername='%s' order by datetime desc" % (status1,status2,name))
        data = cursor.fetchall()
        if data is not None:
            for x in data:
                temp["imageid"] = x[0]
                temp["taskname"] = x[1]
                temp["username"] = x[2]
                temp["receiveusername"] = x[3]
                temp["description"] = x[4]
                temp["datetime"] = x[5]
                temp["status"] = x[6]
                temp["image1"] = x[7]
                temp["image2"] = x[8]
                temp["image3"] = x[9]
                temp["image4"] = x[10]
                temp["image5"] = x[11]
                temp["image6"] = x[12]
                temp["image7"] = x[13]
                temp["image8"] = x[14]
                temp["image9"] = x[15]
                result.append(temp.copy())
                #print(result)
            print(len(data),"Task exists")
            code = 1
            msg = "已完成任务：" +str(len(data)) +"项"
            return jsonify(code=code, msg=msg, result=result)
        #print(data[1],data[2],data[3],data[4],sep="---")
        code = -1
        msg = "没有人发布任务"
        return jsonify(code=code,msg=msg)
    else:
        print("error post")
        jsondata={}
        return jsonify(jsondata)


if __name__ == '__main__':
    app.run(port = 5000, host='localhost', debug = True)