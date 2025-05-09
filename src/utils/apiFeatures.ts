class PrismaAPIFeatures {
  private query: any;
  private queryString: any;

  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (e.g., gte, gt, lte, lt)
    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") {
        Object.keys(queryObj[key]).forEach((operator) => {
          queryObj[key][`_${operator}`] = queryObj[key][operator];
          delete queryObj[key][operator];
        });
      }
    });

    this.query = { ...this.query, where: queryObj };
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field: string) => ({
        [field.startsWith("-") ? field.substring(1) : field]: field.startsWith(
          "-"
        )
          ? "desc"
          : "asc",
      }));
      this.query = { ...this.query, orderBy: sortBy };
    } else {
      this.query = { ...this.query, orderBy: { createdAt: "desc" } };
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",");
      this.query = {
        ...this.query,
        select: fields.reduce(
          (acc: any, field: string) => ({ ...acc, [field]: true }),
          {}
        ),
      };
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = { ...this.query, skip, take: limit };
    return this;
  }

  getQuery() {
    return this.query;
  }
}

export default PrismaAPIFeatures;
