import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','name','password','wins','createdAt','roomId']);

export const RoomScalarFieldEnumSchema = z.enum(['id','code','status','ownerId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoomStatusSchema = z.enum(['LOBBY','IN_GAME']);

export type RoomStatusType = `${z.infer<typeof RoomStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int(),
  createdAt: z.coerce.date(),
  roomId: z.number().int().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ROOM SCHEMA
/////////////////////////////////////////

export const RoomSchema = z.object({
  status: RoomStatusSchema,
  id: z.number().int(),
  code: z.string(),
  ownerId: z.number().int(),
})

export type Room = z.infer<typeof RoomSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  ownedRoom: z.union([z.boolean(),z.lazy(() => RoomArgsSchema)]).optional(),
  joinedRoom: z.union([z.boolean(),z.lazy(() => RoomArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  name: z.boolean().optional(),
  password: z.boolean().optional(),
  wins: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  roomId: z.boolean().optional(),
  ownedRoom: z.union([z.boolean(),z.lazy(() => RoomArgsSchema)]).optional(),
  joinedRoom: z.union([z.boolean(),z.lazy(() => RoomArgsSchema)]).optional(),
}).strict()

// ROOM
//------------------------------------------------------

export const RoomIncludeSchema: z.ZodType<Prisma.RoomInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  players: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoomCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const RoomArgsSchema: z.ZodType<Prisma.RoomDefaultArgs> = z.object({
  select: z.lazy(() => RoomSelectSchema).optional(),
  include: z.lazy(() => RoomIncludeSchema).optional(),
}).strict();

export const RoomCountOutputTypeArgsSchema: z.ZodType<Prisma.RoomCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoomCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoomCountOutputTypeSelectSchema: z.ZodType<Prisma.RoomCountOutputTypeSelect> = z.object({
  players: z.boolean().optional(),
}).strict();

export const RoomSelectSchema: z.ZodType<Prisma.RoomSelect> = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  status: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  players: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoomCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  wins: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  roomId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  ownedRoom: z.union([ z.lazy(() => RoomNullableScalarRelationFilterSchema), z.lazy(() => RoomWhereInputSchema) ]).optional().nullable(),
  joinedRoom: z.union([ z.lazy(() => RoomNullableScalarRelationFilterSchema), z.lazy(() => RoomWhereInputSchema) ]).optional().nullable(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  ownedRoom: z.lazy(() => RoomOrderByWithRelationInputSchema).optional(),
  joinedRoom: z.lazy(() => RoomOrderByWithRelationInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    username: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    username: z.string(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  username: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  wins: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  roomId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  ownedRoom: z.union([ z.lazy(() => RoomNullableScalarRelationFilterSchema), z.lazy(() => RoomWhereInputSchema) ]).optional().nullable(),
  joinedRoom: z.union([ z.lazy(() => RoomNullableScalarRelationFilterSchema), z.lazy(() => RoomWhereInputSchema) ]).optional().nullable(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  wins: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  roomId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const RoomWhereInputSchema: z.ZodType<Prisma.RoomWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => RoomWhereInputSchema), z.lazy(() => RoomWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoomWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoomWhereInputSchema), z.lazy(() => RoomWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumRoomStatusFilterSchema), z.lazy(() => RoomStatusSchema) ]).optional(),
  ownerId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  owner: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  players: z.lazy(() => UserListRelationFilterSchema).optional(),
});

export const RoomOrderByWithRelationInputSchema: z.ZodType<Prisma.RoomOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  players: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
});

export const RoomWhereUniqueInputSchema: z.ZodType<Prisma.RoomWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    code: z.string(),
    ownerId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    code: z.string(),
  }),
  z.object({
    id: z.number().int(),
    ownerId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    code: z.string(),
    ownerId: z.number().int(),
  }),
  z.object({
    code: z.string(),
  }),
  z.object({
    ownerId: z.number().int(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  code: z.string().optional(),
  ownerId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RoomWhereInputSchema), z.lazy(() => RoomWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoomWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoomWhereInputSchema), z.lazy(() => RoomWhereInputSchema).array() ]).optional(),
  status: z.union([ z.lazy(() => EnumRoomStatusFilterSchema), z.lazy(() => RoomStatusSchema) ]).optional(),
  owner: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  players: z.lazy(() => UserListRelationFilterSchema).optional(),
}));

export const RoomOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoomOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoomCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RoomAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoomMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoomMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RoomSumOrderByAggregateInputSchema).optional(),
});

export const RoomScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoomScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => RoomScalarWhereWithAggregatesInputSchema), z.lazy(() => RoomScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoomScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoomScalarWhereWithAggregatesInputSchema), z.lazy(() => RoomScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumRoomStatusWithAggregatesFilterSchema), z.lazy(() => RoomStatusSchema) ]).optional(),
  ownerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  ownedRoom: z.lazy(() => RoomCreateNestedOneWithoutOwnerInputSchema).optional(),
  joinedRoom: z.lazy(() => RoomCreateNestedOneWithoutPlayersInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  roomId: z.number().int().optional().nullable(),
  ownedRoom: z.lazy(() => RoomUncheckedCreateNestedOneWithoutOwnerInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownedRoom: z.lazy(() => RoomUpdateOneWithoutOwnerNestedInputSchema).optional(),
  joinedRoom: z.lazy(() => RoomUpdateOneWithoutPlayersNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  roomId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ownedRoom: z.lazy(() => RoomUncheckedUpdateOneWithoutOwnerNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  roomId: z.number().int().optional().nullable(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  roomId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const RoomCreateInputSchema: z.ZodType<Prisma.RoomCreateInput> = z.strictObject({
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOwnedRoomInputSchema),
  players: z.lazy(() => UserCreateNestedManyWithoutJoinedRoomInputSchema).optional(),
});

export const RoomUncheckedCreateInputSchema: z.ZodType<Prisma.RoomUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  ownerId: z.number().int(),
  players: z.lazy(() => UserUncheckedCreateNestedManyWithoutJoinedRoomInputSchema).optional(),
});

export const RoomUpdateInputSchema: z.ZodType<Prisma.RoomUpdateInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOwnedRoomNestedInputSchema).optional(),
  players: z.lazy(() => UserUpdateManyWithoutJoinedRoomNestedInputSchema).optional(),
});

export const RoomUncheckedUpdateInputSchema: z.ZodType<Prisma.RoomUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => UserUncheckedUpdateManyWithoutJoinedRoomNestedInputSchema).optional(),
});

export const RoomCreateManyInputSchema: z.ZodType<Prisma.RoomCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  ownerId: z.number().int(),
});

export const RoomUpdateManyMutationInputSchema: z.ZodType<Prisma.RoomUpdateManyMutationInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
});

export const RoomUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoomUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const RoomNullableScalarRelationFilterSchema: z.ZodType<Prisma.RoomNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => RoomWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => RoomWhereInputSchema).optional().nullable(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  wins: z.lazy(() => SortOrderSchema).optional(),
  roomId: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const EnumRoomStatusFilterSchema: z.ZodType<Prisma.EnumRoomStatusFilter> = z.strictObject({
  equals: z.lazy(() => RoomStatusSchema).optional(),
  in: z.lazy(() => RoomStatusSchema).array().optional(),
  notIn: z.lazy(() => RoomStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => NestedEnumRoomStatusFilterSchema) ]).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.strictObject({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const RoomCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoomCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
});

export const RoomAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RoomAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
});

export const RoomMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoomMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
});

export const RoomMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoomMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
});

export const RoomSumOrderByAggregateInputSchema: z.ZodType<Prisma.RoomSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  ownerId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumRoomStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoomStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoomStatusSchema).optional(),
  in: z.lazy(() => RoomStatusSchema).array().optional(),
  notIn: z.lazy(() => RoomStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => NestedEnumRoomStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoomStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoomStatusFilterSchema).optional(),
});

export const RoomCreateNestedOneWithoutOwnerInputSchema: z.ZodType<Prisma.RoomCreateNestedOneWithoutOwnerInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoomCreateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedCreateWithoutOwnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutOwnerInputSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputSchema).optional(),
});

export const RoomCreateNestedOneWithoutPlayersInputSchema: z.ZodType<Prisma.RoomCreateNestedOneWithoutPlayersInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoomCreateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedCreateWithoutPlayersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutPlayersInputSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputSchema).optional(),
});

export const RoomUncheckedCreateNestedOneWithoutOwnerInputSchema: z.ZodType<Prisma.RoomUncheckedCreateNestedOneWithoutOwnerInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoomCreateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedCreateWithoutOwnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutOwnerInputSchema).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputSchema).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const RoomUpdateOneWithoutOwnerNestedInputSchema: z.ZodType<Prisma.RoomUpdateOneWithoutOwnerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoomCreateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedCreateWithoutOwnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutOwnerInputSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutOwnerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RoomWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RoomWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoomUpdateToOneWithWhereWithoutOwnerInputSchema), z.lazy(() => RoomUpdateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutOwnerInputSchema) ]).optional(),
});

export const RoomUpdateOneWithoutPlayersNestedInputSchema: z.ZodType<Prisma.RoomUpdateOneWithoutPlayersNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoomCreateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedCreateWithoutPlayersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutPlayersInputSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutPlayersInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RoomWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RoomWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoomUpdateToOneWithWhereWithoutPlayersInputSchema), z.lazy(() => RoomUpdateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutPlayersInputSchema) ]).optional(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const RoomUncheckedUpdateOneWithoutOwnerNestedInputSchema: z.ZodType<Prisma.RoomUncheckedUpdateOneWithoutOwnerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoomCreateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedCreateWithoutOwnerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoomCreateOrConnectWithoutOwnerInputSchema).optional(),
  upsert: z.lazy(() => RoomUpsertWithoutOwnerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RoomWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RoomWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RoomWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoomUpdateToOneWithWhereWithoutOwnerInputSchema), z.lazy(() => RoomUpdateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutOwnerInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOwnedRoomInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutOwnedRoomInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOwnedRoomInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedManyWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutJoinedRoomInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateWithoutJoinedRoomInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyJoinedRoomInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export const UserUncheckedCreateNestedManyWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutJoinedRoomInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateWithoutJoinedRoomInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyJoinedRoomInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export const EnumRoomStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoomStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RoomStatusSchema).optional(),
});

export const UserUpdateOneRequiredWithoutOwnedRoomNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOwnedRoomNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutOwnedRoomInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOwnedRoomInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOwnedRoomInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOwnedRoomInputSchema), z.lazy(() => UserUpdateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOwnedRoomInputSchema) ]).optional(),
});

export const UserUpdateManyWithoutJoinedRoomNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutJoinedRoomNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateWithoutJoinedRoomInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutJoinedRoomInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutJoinedRoomInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyJoinedRoomInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutJoinedRoomInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutJoinedRoomInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutJoinedRoomInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutJoinedRoomInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export const UserUncheckedUpdateManyWithoutJoinedRoomNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutJoinedRoomNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateWithoutJoinedRoomInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema), z.lazy(() => UserCreateOrConnectWithoutJoinedRoomInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutJoinedRoomInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutJoinedRoomInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyJoinedRoomInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutJoinedRoomInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutJoinedRoomInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutJoinedRoomInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutJoinedRoomInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumRoomStatusFilterSchema: z.ZodType<Prisma.NestedEnumRoomStatusFilter> = z.strictObject({
  equals: z.lazy(() => RoomStatusSchema).optional(),
  in: z.lazy(() => RoomStatusSchema).array().optional(),
  notIn: z.lazy(() => RoomStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => NestedEnumRoomStatusFilterSchema) ]).optional(),
});

export const NestedEnumRoomStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoomStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoomStatusSchema).optional(),
  in: z.lazy(() => RoomStatusSchema).array().optional(),
  notIn: z.lazy(() => RoomStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => NestedEnumRoomStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoomStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoomStatusFilterSchema).optional(),
});

export const RoomCreateWithoutOwnerInputSchema: z.ZodType<Prisma.RoomCreateWithoutOwnerInput> = z.strictObject({
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  players: z.lazy(() => UserCreateNestedManyWithoutJoinedRoomInputSchema).optional(),
});

export const RoomUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.RoomUncheckedCreateWithoutOwnerInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  players: z.lazy(() => UserUncheckedCreateNestedManyWithoutJoinedRoomInputSchema).optional(),
});

export const RoomCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.RoomCreateOrConnectWithoutOwnerInput> = z.strictObject({
  where: z.lazy(() => RoomWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoomCreateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedCreateWithoutOwnerInputSchema) ]),
});

export const RoomCreateWithoutPlayersInputSchema: z.ZodType<Prisma.RoomCreateWithoutPlayersInput> = z.strictObject({
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  owner: z.lazy(() => UserCreateNestedOneWithoutOwnedRoomInputSchema),
});

export const RoomUncheckedCreateWithoutPlayersInputSchema: z.ZodType<Prisma.RoomUncheckedCreateWithoutPlayersInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  status: z.lazy(() => RoomStatusSchema).optional(),
  ownerId: z.number().int(),
});

export const RoomCreateOrConnectWithoutPlayersInputSchema: z.ZodType<Prisma.RoomCreateOrConnectWithoutPlayersInput> = z.strictObject({
  where: z.lazy(() => RoomWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoomCreateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedCreateWithoutPlayersInputSchema) ]),
});

export const RoomUpsertWithoutOwnerInputSchema: z.ZodType<Prisma.RoomUpsertWithoutOwnerInput> = z.strictObject({
  update: z.union([ z.lazy(() => RoomUpdateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => RoomCreateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedCreateWithoutOwnerInputSchema) ]),
  where: z.lazy(() => RoomWhereInputSchema).optional(),
});

export const RoomUpdateToOneWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.RoomUpdateToOneWithWhereWithoutOwnerInput> = z.strictObject({
  where: z.lazy(() => RoomWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoomUpdateWithoutOwnerInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutOwnerInputSchema) ]),
});

export const RoomUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.RoomUpdateWithoutOwnerInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => UserUpdateManyWithoutJoinedRoomNestedInputSchema).optional(),
});

export const RoomUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.RoomUncheckedUpdateWithoutOwnerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  players: z.lazy(() => UserUncheckedUpdateManyWithoutJoinedRoomNestedInputSchema).optional(),
});

export const RoomUpsertWithoutPlayersInputSchema: z.ZodType<Prisma.RoomUpsertWithoutPlayersInput> = z.strictObject({
  update: z.union([ z.lazy(() => RoomUpdateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutPlayersInputSchema) ]),
  create: z.union([ z.lazy(() => RoomCreateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedCreateWithoutPlayersInputSchema) ]),
  where: z.lazy(() => RoomWhereInputSchema).optional(),
});

export const RoomUpdateToOneWithWhereWithoutPlayersInputSchema: z.ZodType<Prisma.RoomUpdateToOneWithWhereWithoutPlayersInput> = z.strictObject({
  where: z.lazy(() => RoomWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoomUpdateWithoutPlayersInputSchema), z.lazy(() => RoomUncheckedUpdateWithoutPlayersInputSchema) ]),
});

export const RoomUpdateWithoutPlayersInputSchema: z.ZodType<Prisma.RoomUpdateWithoutPlayersInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutOwnedRoomNestedInputSchema).optional(),
});

export const RoomUncheckedUpdateWithoutPlayersInputSchema: z.ZodType<Prisma.RoomUncheckedUpdateWithoutPlayersInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => RoomStatusSchema), z.lazy(() => EnumRoomStatusFieldUpdateOperationsInputSchema) ]).optional(),
  ownerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserCreateWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserCreateWithoutOwnedRoomInput> = z.strictObject({
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  joinedRoom: z.lazy(() => RoomCreateNestedOneWithoutPlayersInputSchema).optional(),
});

export const UserUncheckedCreateWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOwnedRoomInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  roomId: z.number().int().optional().nullable(),
});

export const UserCreateOrConnectWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOwnedRoomInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutOwnedRoomInputSchema) ]),
});

export const UserCreateWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserCreateWithoutJoinedRoomInput> = z.strictObject({
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  ownedRoom: z.lazy(() => RoomCreateNestedOneWithoutOwnerInputSchema).optional(),
});

export const UserUncheckedCreateWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutJoinedRoomInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  ownedRoom: z.lazy(() => RoomUncheckedCreateNestedOneWithoutOwnerInputSchema).optional(),
});

export const UserCreateOrConnectWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutJoinedRoomInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema) ]),
});

export const UserCreateManyJoinedRoomInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyJoinedRoomInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => UserCreateManyJoinedRoomInputSchema), z.lazy(() => UserCreateManyJoinedRoomInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserUpsertWithoutOwnedRoomInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOwnedRoomInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutOwnedRoomInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOwnedRoomInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOwnedRoomInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOwnedRoomInputSchema) ]),
});

export const UserUpdateWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserUpdateWithoutOwnedRoomInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  joinedRoom: z.lazy(() => RoomUpdateOneWithoutPlayersNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutOwnedRoomInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOwnedRoomInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  roomId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserUpsertWithWhereUniqueWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutJoinedRoomInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedUpdateWithoutJoinedRoomInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedCreateWithoutJoinedRoomInputSchema) ]),
});

export const UserUpdateWithWhereUniqueWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutJoinedRoomInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutJoinedRoomInputSchema), z.lazy(() => UserUncheckedUpdateWithoutJoinedRoomInputSchema) ]),
});

export const UserUpdateManyWithWhereWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutJoinedRoomInput> = z.strictObject({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema), z.lazy(() => UserUncheckedUpdateManyWithoutJoinedRoomInputSchema) ]),
});

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  wins: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  roomId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const UserCreateManyJoinedRoomInputSchema: z.ZodType<Prisma.UserCreateManyJoinedRoomInput> = z.strictObject({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
  wins: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
});

export const UserUpdateWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUpdateWithoutJoinedRoomInput> = z.strictObject({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownedRoom: z.lazy(() => RoomUpdateOneWithoutOwnerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutJoinedRoomInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ownedRoom: z.lazy(() => RoomUncheckedUpdateOneWithoutOwnerNestedInputSchema).optional(),
});

export const UserUncheckedUpdateManyWithoutJoinedRoomInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutJoinedRoomInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  wins: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Omit<Prisma.UserFindFirstArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Omit<Prisma.UserFindManyArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Omit<Prisma.UserFindUniqueArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
}).strict();

export const RoomFindFirstArgsSchema: z.ZodType<Omit<Prisma.RoomFindFirstArgs, "select" | "include">> = z.object({
  where: RoomWhereInputSchema.optional(), 
  orderBy: z.union([ RoomOrderByWithRelationInputSchema.array(), RoomOrderByWithRelationInputSchema ]).optional(),
  cursor: RoomWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const RoomFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.RoomFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: RoomWhereInputSchema.optional(), 
  orderBy: z.union([ RoomOrderByWithRelationInputSchema.array(), RoomOrderByWithRelationInputSchema ]).optional(),
  cursor: RoomWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const RoomFindManyArgsSchema: z.ZodType<Omit<Prisma.RoomFindManyArgs, "select" | "include">> = z.object({
  where: RoomWhereInputSchema.optional(), 
  orderBy: z.union([ RoomOrderByWithRelationInputSchema.array(), RoomOrderByWithRelationInputSchema ]).optional(),
  cursor: RoomWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoomScalarFieldEnumSchema, RoomScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const RoomAggregateArgsSchema: z.ZodType<Prisma.RoomAggregateArgs> = z.object({
  where: RoomWhereInputSchema.optional(), 
  orderBy: z.union([ RoomOrderByWithRelationInputSchema.array(), RoomOrderByWithRelationInputSchema ]).optional(),
  cursor: RoomWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const RoomGroupByArgsSchema: z.ZodType<Prisma.RoomGroupByArgs> = z.object({
  where: RoomWhereInputSchema.optional(), 
  orderBy: z.union([ RoomOrderByWithAggregationInputSchema.array(), RoomOrderByWithAggregationInputSchema ]).optional(),
  by: RoomScalarFieldEnumSchema.array(), 
  having: RoomScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const RoomFindUniqueArgsSchema: z.ZodType<Omit<Prisma.RoomFindUniqueArgs, "select" | "include">> = z.object({
  where: RoomWhereUniqueInputSchema, 
}).strict();

export const RoomFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.RoomFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: RoomWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Omit<Prisma.UserCreateArgs, "select" | "include">> = z.object({
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Omit<Prisma.UserUpsertArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Omit<Prisma.UserDeleteArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Omit<Prisma.UserUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const RoomCreateArgsSchema: z.ZodType<Omit<Prisma.RoomCreateArgs, "select" | "include">> = z.object({
  data: z.union([ RoomCreateInputSchema, RoomUncheckedCreateInputSchema ]),
}).strict();

export const RoomUpsertArgsSchema: z.ZodType<Omit<Prisma.RoomUpsertArgs, "select" | "include">> = z.object({
  where: RoomWhereUniqueInputSchema, 
  create: z.union([ RoomCreateInputSchema, RoomUncheckedCreateInputSchema ]),
  update: z.union([ RoomUpdateInputSchema, RoomUncheckedUpdateInputSchema ]),
}).strict();

export const RoomCreateManyArgsSchema: z.ZodType<Prisma.RoomCreateManyArgs> = z.object({
  data: z.union([ RoomCreateManyInputSchema, RoomCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const RoomCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoomCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoomCreateManyInputSchema, RoomCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const RoomDeleteArgsSchema: z.ZodType<Omit<Prisma.RoomDeleteArgs, "select" | "include">> = z.object({
  where: RoomWhereUniqueInputSchema, 
}).strict();

export const RoomUpdateArgsSchema: z.ZodType<Omit<Prisma.RoomUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ RoomUpdateInputSchema, RoomUncheckedUpdateInputSchema ]),
  where: RoomWhereUniqueInputSchema, 
}).strict();

export const RoomUpdateManyArgsSchema: z.ZodType<Prisma.RoomUpdateManyArgs> = z.object({
  data: z.union([ RoomUpdateManyMutationInputSchema, RoomUncheckedUpdateManyInputSchema ]),
  where: RoomWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const RoomUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RoomUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RoomUpdateManyMutationInputSchema, RoomUncheckedUpdateManyInputSchema ]),
  where: RoomWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const RoomDeleteManyArgsSchema: z.ZodType<Prisma.RoomDeleteManyArgs> = z.object({
  where: RoomWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();