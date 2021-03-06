# Customize error message

I know, I know, you wanna customize the error text? How about this?

```javascript
const formSchema = {
    title: {
        minLength: [2, 'It`s too short man :('],
        maxLength: 6
    }
};
```

Now, the `props` will be:

```javascript
{
  status: 'error',
  errorText: 'It`s too short man :(',
  value: 'a'
}
```

!> `Veasy` may accept array as value for some rules. But the rule of thumb is: You can always wrap them in an array, and set your error message as the 2nd item.

An example:

```javascript
const formSchema = {
    title: {
        inArray: [
          ['a.com', 'b.com', 'c.com'],
          'Please choose between the 3'
        ]
    }
};
```

Customize an error message has never been this easy.

## What's next

- Move on to [Step 2. initial state](/initial-state).

Or learn more about `schema`:

- [collect values from non-veasy state](/collect-values)
- To see [more examples of schema](/more-examples)
