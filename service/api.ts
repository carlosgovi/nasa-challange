const DEMO_KEY = "&api_key=mn0cL646A86fzVD3vI3MdMpphxncHeUDjNCzgPja";
async function fetchAPI(
  input: { page: number; rovers: string },
  options?: any
) {
  const page = input.page ? input.page : 1;
  const rovers = input.rovers ? input.rovers : "curiosity";
  const BASE_URL =
    "https://api.nasa.gov/mars-photos/api/v1/rovers/" +
    rovers +
    "/photos?sol=1000&page=";
  input = input || {};

  const url = BASE_URL + page + DEMO_KEY;

  const newOptions: any = options || {};

  newOptions.headers ||= {};

  newOptions.headers["Content-Type"] = "application/json";
  if (newOptions.body) {
    newOptions.body = JSON.stringify(newOptions.body);
  }

  const res = await fetch(url);
  if (res.status >= 200 && res.status < 300) {
    return await res.json();
  } else {
    throw { message: "hubo un error ", status: res.status };
  }
}

export { fetchAPI };
