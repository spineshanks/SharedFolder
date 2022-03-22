let _loanObj = {},
    _authObj = {};

let _userObj;
let _loanData; // To be populated once you get loan data from Host
let _clientAuthCode;
// Invoke the mainInit() once the DOM is loaded
document.addEventListener("DOMContentLoaded", function (event) {
    mainInit();
});

function mainInit() {
    // CHeck if elli and elli.script exists before kicking off the 
    // process to create the guest and get data from Host
    if (elli && elli.script) {
        elli.script.guest.create('', document.head);
        // loanChangeEvent will be fired everytime you call setField function
        elli.script.subscribe('loan', 'change', loanChangeEvent);
        getObjects();
    }
}

async function loanChangeEvent(obj, data) {
    console.log('Loan change event fired: ', obj, data);
}

async function getObjects() {
    // Uses async/await to get the auth and loan objects
    _authObj = await elli.script.getObject('auth');
    _loanObj = await elli.script.getObject('loan');
    getUserInfo();
    // getClientAuthCode(); //--> Implementation example for obtaining auth code
    getLoanObj();
}

/*  getUserInfo() provides user information from host. 
    Response is an object in the following form :
    userObject = {
      id: 'userId',
      realm: 'realm',
      fistName: 'firstName',
      lastName: 'lastName'
    };
*/
function getUserInfo() {
    _authObj.getUser().then(userInfo => {
        console.log('Heres the user from encw', userInfo);
        _userObj = userInfo;
    })
        .catch(err => {
            window.alert('Error while fetching user obj');
        });
}

/*  getClientAuthCode() provides user with an acccess_token from host. 
    Response is a string. This acccess_token can be used to make API calls 
    to DevConnect.
*/
function getClientAuthCode() {
    return _authObj.createAuthCode().then(clientAuthCode => {
        console.log('Heres the client auth code from encw', clientAuthCode);
        _clientAuthCode = clientAuthCode;
    })
        .catch(err => {
            window.alert('Error while fetching user obj');
        });
}

/*  getLoanObj() gets the current workspace response from host.
    If the loan is not saved, this would still have the old copy of loan.
    Use merge() method to get the updated loan. More info below in merge().
*/
function getLoanObj() {
    _loanObj.all().then(loanDataResp => {
        console.log('Heres the loan from encw', loanDataResp);
        _loanData = loanDataResp;
    })
        .catch(err => {
            window.alert('Error while fetching loan obj');
        });
}