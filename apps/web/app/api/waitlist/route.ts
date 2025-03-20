import apiClient from "@/lib/server-api-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    try {
      const response = await apiClient.post("/waitlist", { email });
      return NextResponse.json(
        { message: "Successfully joined waitlist" },
        { status: 201 }
      );
    } catch (axiosError: any) {
      // Handle Axios error responses
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = axiosError.response.status;
        const errorMessage = axiosError.response.data?.error || axiosError.response.data?.message;

        switch (status) {
          case 409:
            return NextResponse.json(
              { error: errorMessage || "Email already exists in waitlist" },
              { status: 409 }
            );
          case 400:
            return NextResponse.json(
              { error: errorMessage || "Invalid email address" },
              { status: 400 }
            );
          default:
            return NextResponse.json(
              { error: errorMessage || "Failed to join waitlist" },
              { status: status }
            );
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        return NextResponse.json(
          { error: "No response from server" },
          { status: 500 }
        );
      } else {
        // Something happened in setting up the request
        return NextResponse.json(
          { error: "Failed to make request" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error processing waitlist request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}