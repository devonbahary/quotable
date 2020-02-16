import React from "react";
import { inject, observer } from "mobx-react";
import View from "./View";


const User = observer(({ store }) => {
    return (
        <View>

        </View>
    );
});

export default inject('store')(User);