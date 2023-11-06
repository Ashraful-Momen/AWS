var region = "ap-south-1";
var accessKeyId = "AKIA2MQJ54XJJFCDRP76";
var secretAccessKey = "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";

AWS.config.update(
    {
        region: region,
        credentials: new AWS.Credentials(accessKeyId,secretAccessKey),
    }
)

var s3 = new AWS.S3()

let refreshFileList =(bucketName)=>{
    var tableBody = document.querySelector("#fileTable tbody");
    tableBody.innerHTML = "";

    s3.listObjectsV2({Bucket:bucketName},(error,data)=>{ //bucketname, func(listening from s3)
            if(error){
                console.log("Error fetching fileList ",error)
            }
            else{
                // console.log(data)
                data.Contents.forEach((object)=>{
                    var fileRow = document.createElement('tr')

                    var  fileNameCell =  document.createElement('td')
                    fileNameCell.textContent = object.Key
                    fileRow.appendChild(fileNameCell)

                    var  fileSizeCell =  document.createElement('td')
                    fileSizeCell.textContent = object.Size
                    fileRow.appendChild(fileSizeCell)

                    var downloadCell = document.createElement('td')
                    var downloadLink = document.createElement('a')
                    downloadLink.href = s3.getSignedUrl("getObject",{
                        Bucket:bucketName,
                        Key: object.Key,
                    });
                    
                    downloadLink.textContent = 'Download'
                    downloadCell.appendChild(downloadLink)
                    fileRow.appendChild(downloadCell)

                    var deleteCell = document.createElement('td')
                    var deleteButton = document.createElement('button')
                    deleteButton.textContent = 'DELETE'
                    deleteButton.addEventListener('click',()=>{
                        deleteFile(bucketName,object.Key)
                    })
                    deleteCell.appendChild(deleteButton)
                    fileRow.appendChild(deleteCell)

                    tableBody.appendChild(fileRow)

                })
            }
    })
}


function uploadFile(bucketName="crud-with-s3"){ // index.html pass the function 
    
    let files =  document.getElementById("fileInput").files 
    var fileCount = files.length

    for(var i=0;i<fileCount;i++){
        var file= files[i];
        var params = {
            Bucket:bucketName,
            Key:file.name,
            Body:file,
        }

        s3.upload(params,(error,data)=>{
            console.log("File Uploaded success fully")
            // if(error){
            //     console.log("Error for uploading ",error)
            // }
            // else{
            //     console.log("File uploading successfully",data)
            // }
            refreshFileList(bucketName)
        })
    }

}


function deleteFile(bucketName,key){
     
    var params = {
        Bucket:bucketName,
        Key:key,
    }
    s3.deleteObject(params,(error,data)=>{
        console.log("Delete Item Successfully!");
        refreshFileList(bucketName)
    })
}


refreshFileList("crud-with-s3")