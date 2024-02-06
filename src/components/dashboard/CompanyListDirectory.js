export class CompanyDirectory {
  constructor(companyList = companyList) {
    this.companyList = companyList;
  }

  // Method to find a company by name and return the dictionary (object)
  findCompanyByName(name) {
    // console.log(name);

    if (!name) return null;
    return (
      this.companyList.find(
        (company) => company.name.toLowerCase() === name.toLowerCase()
      ) || null
    );
  }

  // Method to find a company by URL and return the dictionary (object)
  findCompanyByUrl(url) {
    return (
      this.companyList.find(
        (company) => company.url.toLowerCase() === url.toLowerCase()
      ) || null
    );
  }

  // Method to autocomplete a company name and return the best match dictionary (object)
  autocompleteCompanyName(name) {
    const lowerCaseName = name.toLowerCase();
    return (
      this.companyList.find((company) =>
        company.name.toLowerCase().startsWith(lowerCaseName)
      ) || null
    );
  }
}
