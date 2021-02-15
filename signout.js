const fs = require('fs')
const cred = require('data-store')({ path: process.cwd() + '\\creds.json' });
const https = require("https");
const Swal = require('sweetalert2')
const NodeRSA = require("node-rsa");
const axios = require("axios");
const { parse, stringify } = require("flatted");


const server_public_key =
  "\n-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAI/Ip/FSDW2ZQfUSfbrFJrVx95crrvUg\n5pi8GEZ5Z1Ahw3UwQlcqQqPlC0FKDcWSvDk1Md7wpk5/PpkxVH6AAK0CAwEAAQ==\n-----END PUBLIC KEY-----\n";
const server_pubkey = NodeRSA(server_public_key, "pkcs8-public-pem");

const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

function signmeout(){
    const uniq_name = cred.get('unique-username')
    if(fs.existsSync('./creds.json')){
        fs.unlink('./creds.json')
    }

    data = {
        'username':uniq_name
    }

    let stringUserDetails = stringify(data);
    let encryptedDetails = server_pubkey.encrypt(stringUserDetails);
    let hexEnc = Buffer.from(encryptedDetails).toString("hex");
    url = "https://3.131.252.234:8443/api/generalusersignout/" + hexEnc;

    Swal.fire({
        icon: 'info',
        title: '<p style="color:#FFF";>Please Wait</p>',
        width: '350',
        html: '<p style="color:#FFF";>Please wait while we sign you out</p>',
        background: '#000000',
        allowOutsideClick: false,
        showConfirmButton: false
      })

    let response = axiosTest().then(function (data) {
    switch (data) {
        case 'SUCCESS: SIGNED OUT':
            Swal.fire({
                icon: 'success',
                title: '<p style="color:#FFF";>Success</p>',
                width: '350',
                html: '<p style="color:#FFF";>Successfully signed out</p>',
                background: '#000000'
              }).then((result) => {
                window.location.href = "index.html";        
              })
        break;

        case 'ERROR: FAILED TO SIGNOUT':
            Swal.fire({
                icon: 'error',
                title: '<p style="color:#FFF";>Error</p>',
                width: '350',
                html: '<p style="color:#FFF";>Failed to sign out, contack helpdesk or try again</p>',
                background: '#000000'
              })
        break;
    }})
}

function axiosTest() {
    return instance.get(url).then((response) => response.data);
  }
  
