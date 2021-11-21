var userExist = false;
var userFullName = "";

function initFirebase() {
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            console.log("auth change logged in");
            if(user.displayName){
                $(".name").html(user.displayName);
            }
            $("#signOutBtn").prop("disabled", false);
            userExists = true;
        }else{
            console.log("auth change logged out");
            $(".name").html("");
            $("#signOutBtn").prop("disabled", true);
            userExists = false;
            userFullName = "";
        }
    });
}

function login() {
    let email = $("#log-email").val();
    let pass = $("#log-pw").val();

    firebase
        .auth()
        .signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("logged in");
            $("#log-email").val("");
            $("#log-pw").val("");
            // these two make the input bars empty once logged in so the email and pass aren't just sitting there even after logging in
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("logged in error " + errorMessage);
  });
}

function createAccount() {
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let pass = $("#pw").val();
    let fullName = fName + " " + lName;

    console.log("create " + fName + " " + lName + " " + email + " " + pass);

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log("account created");
            firebase.auth().currentUser.updateProfile({
                displayName: fullName,
            });
            userFullName = fullName;
            $(".name").html(userFullName);
            $("#fName").val("");
            $("#lName").val("");
            $("#email").val("");
            $("#pw").val("");
            // these two make the input bars empty once logged in so the email and pass aren't just sitting there even after logging in
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("create account error " + errorMessage);
            // ..
  });

}

function signIn() {
    firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Signed in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error signing in" + errorMessage);
  });
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("signed out");
        })
        .catch((error) => {
            console.log("error signing out");
        });
}

function initListeners() {
    $("nav .links a").click(function(e){
        let btnID = e.currentTarget.id;
        // console.log("click" + btnID);
        MODEL.changePageContent(btnID)
        
    })

    $(".bars").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
    });

    $(".links a").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
    });
}



$(document).ready(function() {
    try{
        let app = firebase.app();
        initFirebase();
        initListeners();
    } catch(error){
        console.log("error ", error);
    };
    

    MODEL.changePageContent("home");
});