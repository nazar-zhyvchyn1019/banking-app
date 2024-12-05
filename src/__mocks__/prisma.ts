const prismaMock = {
    account: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};

export default prismaMock;
