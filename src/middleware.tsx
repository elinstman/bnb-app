import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./app/utils/jwt";

const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
const UNSAFE_REQUESTS = ["/api/users/me"];

export async function middleware(request: NextRequest) {

    const url = new URL(request.url);

    console.log('middleware called', url.pathname);

    if(UNSAFE_METHODS.includes(request.method) || UNSAFE_REQUESTS.includes(url.pathname)){
        try {

            console.log("Unsafe")
            //TODO: get authrization header
            const Authorization = request.headers.get("Authorization");
            if(!Authorization) {
                console.log("No Authorization header found");
                throw new Error("No authrization header")
            }
              //TODO: get token
            const token = Authorization.split(" ")?.[1] || null
            if(!token) {
                throw new Error("No token")
            }
            console.log("Authorization -> token", token)
          
            //TODO: validate token
            const decryptedToken = await verifyJWT(token);
            if(!decryptedToken) {
                throw new Error("No token payload")
            }
            console.log("Authorization -> decrypted", decryptedToken)

            //TODO: send with userId
            const headers = new Headers(request.headers);
            headers.set("userId", decryptedToken.userId);
             return NextResponse.next({
            headers,
      });
        } catch(error: any) {
            console.log("Error validating token: ", error.message);

            return NextResponse.json({
                message: "Unauthenticated"
            }, { status: 401 })
        }
    }
    console.log("Safe")
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/authors/',
        '/api/authors/:id*',
        '/api/users/me',
        '/api/properties',
        '/api/bookings'
        // '/api/auth/login/:id*',
    ],
};


// Jonatanskod nedan.

// import { NextRequest, NextResponse } from "next/server";
// import { verifyJWT } from "./utils/jwt";

// const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

// export async function middleware(request: NextRequest) {
//   console.log("middleware called");
//   if (UNSAFE_METHODS.includes(request.method)) {
//     try {
//       console.log("Unsafe");
//       const Authorization = request.headers.get("Authorization");
//       if (!Authorization) {
//         throw new Error("No authrization header");
//       }
//       const token = Authorization.split(" ")?.[1] || null;
//       if (!token) {
//         throw new Error("No token");
//       }
//       console.log("Authorization -> token", token);
//       const decryptedToken = await verifyJWT(token);
//       if (!decryptedToken) {
//         throw new Error("No token payload");
//       }
//       console.log("Authorization -> decrypted", decryptedToken);
//       //TODO: send with userId
//       const headers = new Headers(request.headers);
//       headers.set("userId", decryptedToken.userId);
//       return NextResponse.next({
//         headers,
//       });
//     } catch (error: any) {
//       console.log("Error validating token: ", error.message);
//       return NextResponse.json(
//         {
//           message: "Unauthenticated",
//         },
//         { status: 401 }
//       );
//     }
//   }
//   console.log("Safe");
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/api/authors/", "/api/authors/:id*"],
// };
