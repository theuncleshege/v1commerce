import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { getUserId, APP_SECRET, fetchData, deleteProductImage } from "../src/utils";
import { users, emptyUsers } from "./seed";

const token = jwt.sign({ userId: users[0].id }, APP_SECRET);
const context = {
  "request": {
    "headers": {
      "authorization": `Bearer ${token}`
    }
  }
};
const wrongTokenContext = {
  "request": {
    "headers": {
      "authorization": "Bearer djkfhsdkjfhdsj"
    }
  }
};

describe("Utils", () => {
  describe("User Utils", () => {
    it("should return correct userId from token", () => {
      const userId = getUserId(context);
      expect(userId).toBe(users[0].id);
    });

    it("should throw error for fetching incorrect data type", () => {
      expect(() => {
        fetchData("userss");
      }).toThrow(Error);
    });

    it("should return empty list of users", () => {
      emptyUsers();
      const _users = fetchData("users");
      expect(_users.length).toBe(0);
    });
  });

  describe("Product Utils", () => {
    it("should throw error for unauthorized requests", () => {
      expect(() => {
        getUserId({});
      }).toThrow(Error);

      expect(() => {
        getUserId({
          "request": {}
        });
      }).toThrow(Error);

      expect(() => {
        getUserId({
          "request": {
            "headers": {}
          }
        });
      }).toThrow(Error);
    });

    it("should throw error for incorrect token requests", () => {
      expect(() => {
        getUserId(wrongTokenContext);
      }).toThrowError(JsonWebTokenError);
    });

    it("should not delete an invalid product image", () => {
      const result = deleteProductImage("not-existing-image");
      expect(result).toBeFalsy();
    });
  });
});
