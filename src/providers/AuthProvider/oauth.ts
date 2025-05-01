import {
	GithubAuthProvider,
	GoogleAuthProvider,
	OAuthProvider,
} from "firebase/auth";

const githubProvider = new GithubAuthProvider();
// scope for user profile data and email
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

export { githubProvider, googleProvider, appleProvider };
