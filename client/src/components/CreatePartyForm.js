import React from "react";

function CreatePartyForm() {
  return (
    <div> 
      Join Party!!
      <form>
        <label>
          UserName:
          <input type="text" />
          Party Type:
          <select defaultValue="public">
            <option value="public">Public Room</option>
            <option value="private">Private Room</option>
          </select>
        </label>
        <input type="submit" value="Join" />
      </form>
    </div>
  )
}

export default CreatePartyForm;