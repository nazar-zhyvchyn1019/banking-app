import React from "react";
import { SVGAttributes } from "react";
export default function ProfileIcon({
    ...props
}: SVGAttributes<SVGSVGElement>) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.4116 6.07587C14.4116 8.52339 12.4492 10.4859 9.99991 10.4859C7.55149 10.4859 5.58826 8.52339 5.58826 6.07587C5.58826 3.62834 7.55149 1.66666 9.99991 1.66666C12.4492 1.66666 14.4116 3.62834 14.4116 6.07587ZM9.99992 18.3333C6.38523 18.3333 3.33325 17.7458 3.33325 15.4791C3.33325 13.2116 6.4044 12.6449 9.99992 12.6449C13.6154 12.6449 16.6666 13.2324 16.6666 15.4991C16.6666 17.7667 13.5954 18.3333 9.99992 18.3333Z"
                fill="currentColor"
            />
        </svg>
    );
}
