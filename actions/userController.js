"use server"

export const register = async function (prevState, formData){
  console.log("Hello, This is executing on the server!")
  return {
    skyColor: "blue",
    grassColor: "green"
  }
}