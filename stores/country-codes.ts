import  * as countryCodes from 'country-codes-list'

const myCountryCodesObject = countryCodes.customList(
    "countryCode",
    "[{countryCode}]: +{countryCallingCode}"
  );
  console.log(myCountryCodesObject);
  
export const useCountryCodes = () => {
    return {
        myCountryCodesObject
    }
}
