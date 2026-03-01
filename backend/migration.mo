import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type User = {
    password : Text;
    role : Text;
  };

  // Old actor type (as it used to be, with just the old users)
  type OldActor = {
    users : Map.Map<Text, User>;
  };

  // New actor type (the updated one, including new admin)
  type NewActor = {
    users : Map.Map<Text, User>;
  };

  public func run(old : OldActor) : NewActor {
    // Create new users map by copying old map and adding seeded users again.
    let newUsersMap = old.users.clone();
    newUsersMap.add("genmitra", { password = "12345678"; role = "admin" });
    newUsersMap.add("admin", { password = "Admin@1234"; role = "admin" });
    newUsersMap.add("user", { password = "1234"; role = "user" });

    // Return new actor state with properly seeded users
    { users = newUsersMap };
  };
};
