# Step 2/3: Initial State

It's just like how you bind your `state` to the `React component`. But first you need to know what does the state look like.

## Create initial state with default value

`EasyV` will generate the initial state for you according to the `schema` you just defined. We'll eliminate boilerplate code as much as possible.

```javascript
import { createInitialState } from 'easyv';
const initialState = createInitialState(formSchema);
```

Easy, you just invoke the `createInitialState()` method with the `schema` you defined.
And it will result in the following `initialState`:

```javascript
{
  isFormOK: false,
  title: {
    status: 'normal',
    errorText: '',
    value: '',
  },
  age: {
    status: 'normal',
    errorText: '',
    value: '16',
  }
}
```

Wait, why the `age` field starts with a value of `16` rather than the empty string like `title`?

Yes, that's right, since you can define its default value when you define the schema:

```javascript
{
  age: {
    min: 19,
    max: 99,
    default: '16',
  }
}
```

Just that easy, you declare how you want it to be, then it will just looks like that. :)

Now you can:

- Move on to final [binding](/binding) section

- To learn how to [add your own state to the root level of generated state](/customize-add).
- To learn how to [add your own state as a child of field item state](/customize-reuse).